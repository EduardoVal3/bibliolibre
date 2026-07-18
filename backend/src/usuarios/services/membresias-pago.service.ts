import { Injectable, BadRequestException, ForbiddenException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { PagoMembresia } from '../entities/pago-membresia.entity';
import { Membresia } from '../entities/membresia.entity';
import { HistorialMembresia } from '../entities/historial-membresia.entity';

@Injectable()
export class MembresiasPagoService {
  private tokenCache: { token: string; exp: number } | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
    @InjectRepository(PagoMembresia)
    private readonly pagoRepo: Repository<PagoMembresia>,
    @InjectRepository(Membresia)
    private readonly membresiaRepo: Repository<Membresia>,
    @InjectRepository(HistorialMembresia)
    private readonly historialRepo: Repository<HistorialMembresia>,
  ) {}

  private getPayPalBaseUrl() {
    const env = this.configService.get<string>('PAYPAL_ENV', 'sandbox');
    return env === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
  }

  private async getAccessToken(): Promise<string> {
    if (this.tokenCache && this.tokenCache.exp > Date.now()) {
      return this.tokenCache.token;
    }
    const clientId = this.configService.get<string>('PAYPAL_CLIENT_ID');
    const secret = this.configService.get<string>('PAYPAL_CLIENT_SECRET');
    if (!clientId || !secret) throw new Error('PayPal credentials not configured');

    const res = await fetch(`${this.getPayPalBaseUrl()}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    const json = await res.json();
    if (!res.ok) throw new Error(`PayPal auth failed: ${json.error_description || json.error}`);
    this.tokenCache = { token: json.access_token, exp: Date.now() + (json.expires_in - 60) * 1000 };
    return json.access_token;
  }

  private async findMembresiaActiva(idUsuario: number) {
    const rows = await this.dataSource.query(
      `SELECT h.idhistorialmembresia, h.idmembresia, m.nombremembresia, m.nivel
       FROM historial_membresias h
       JOIN membresias m ON m.idmembresia = h.idmembresia
       WHERE h.idusuario = $1 AND (h.fechafin IS NULL OR h.fechafin >= CURRENT_DATE)
       ORDER BY h.fechainicio DESC LIMIT 1`,
      [idUsuario],
    );
    return rows[0] || null;
  }

  async findDisponibles(idUsuario: number) {
    const activa = await this.findMembresiaActiva(idUsuario);
    const nivelActual = activa?.nivel ?? 0;
    return this.membresiaRepo
      .createQueryBuilder('m')
      .where('m.nivel > :nivel', { nivel: nivelActual })
      .orderBy('m.nivel', 'ASC')
      .getMany();
  }

  async crearOrden(idUsuario: number, idMembresia: number) {
    const destino = await this.membresiaRepo.findOne({ where: { idMembresia } });
    if (!destino) throw new BadRequestException('Membership not found');

    const activa = await this.findMembresiaActiva(idUsuario);
    const nivelActual = activa?.membresia?.nivel ?? 0;
    if (destino.nivel <= nivelActual) {
      throw new ForbiddenException('You already have an equal or higher membership level');
    }

    if (!destino.costo || destino.costo <= 0) {
      throw new BadRequestException('This membership has no associated cost');
    }

    const token = await this.getAccessToken();
    const res = await fetch(`${this.getPayPalBaseUrl()}/v2/checkout/orders`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: `membresia_${idMembresia}`,
          amount: { currency_code: 'USD', value: destino.costo.toFixed(2) },
          description: destino.nombreMembresia,
        }],
      }),
    });
    const order = await res.json();
    if (!res.ok) throw new Error(`PayPal order creation failed: ${order.message || 'unknown'}`);

    const pago = this.pagoRepo.create({
      idUsuario,
      idMembresia,
      proveedor: 'PayPal',
      idOrdenExterna: order.id,
      monto: destino.costo,
      moneda: 'USD',
    });
    await this.pagoRepo.save(pago);
    return { id: order.id, status: order.status, links: order.links };
  }

  async capturarOrden(idOrdenExterna: string, idUsuario: number) {
    const pago = await this.pagoRepo.findOne({ where: { idOrdenExterna, idUsuario } });
    if (!pago) throw new BadRequestException('Order not found');
    if (pago.estado !== 'Pendiente') throw new BadRequestException('Order already processed');

    const token = await this.getAccessToken();
    const res = await fetch(`${this.getPayPalBaseUrl()}/v2/checkout/orders/${idOrdenExterna}/capture`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    });
    const capture = await res.json();
    if (!res.ok) throw new Error(`PayPal capture failed: ${capture.message || 'unknown'}`);

    if (capture.status === 'COMPLETED') {
      pago.estado = 'Completado';
      pago.fechaConfirmacion = new Date().toISOString() as any;
      await this.pagoRepo.save(pago);
      await this.dataSource.query(`CALL sp_actualizar_membresia_pagada($1, $2)`, [idUsuario, pago.idMembresia]);
      return { status: 'COMPLETED', id: capture.id };
    }
    return { status: capture.status, id: capture.id };
  }

  async procesarWebhook(body: any, headers: Record<string, string>) {
    const env = this.configService.get<string>('PAYPAL_ENV', 'sandbox');
    const webhookId = this.configService.get<string>('PAYPAL_WEBHOOK_ID');
    if (env !== 'sandbox' && webhookId) {
      const token = await this.getAccessToken();
      const verifyUrl = `${this.getPayPalBaseUrl()}/v1/notifications/verify-webhook-signature`;
      const res = await fetch(verifyUrl, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auth_algo: headers['paypal-auth-algo'],
          cert_url: headers['paypal-cert-url'],
          transmission_id: headers['paypal-transmission-id'],
          transmission_sig: headers['paypal-transmission-sig'],
          transmission_time: headers['paypal-transmission-time'],
          webhook_id: webhookId,
          webhook_event: body,
        }),
      });
      const verification = await res.json();
      if (verification.verification_status !== 'SUCCESS') return HttpStatus.FORBIDDEN;
    }

    if (body.event_type === 'CHECKOUT.ORDER.APPROVED' || body.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const orderId = body.resource?.id || body.resource?.supplementary_data?.related_ids?.order_id;
      if (!orderId) return;

      const pago = await this.pagoRepo.findOne({ where: { idOrdenExterna: orderId } });
      if (pago && pago.estado === 'Pendiente') {
        pago.estado = 'Completado';
        pago.fechaConfirmacion = new Date().toISOString() as any;
        await this.pagoRepo.save(pago);
        await this.dataSource.query(`CALL sp_actualizar_membresia_pagada($1, $2)`, [pago.idUsuario, pago.idMembresia]);
      }
    }
  }
}
