import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Prestamo } from '../entities/prestamo.entity';
import { DetallePrestamo } from '../entities/detalle-prestamo.entity';
import { Devolucion } from '../entities/devolucion.entity';
import { Reserva } from '../entities/reserva.entity';
import { HistorialPrestamo } from '../entities/historial-prestamo.entity';
import { VwPrestamoActivo } from '../entities/vw-prestamo-activo.entity';
import { EdicionVolumen } from '../../catalogo/entities/edicion-volumen.entity';
import { CreatePrestamoDto } from '../dto/create-prestamo.dto';
import { CreateDevolucionDto } from '../dto/create-devolucion.dto';
import { CreateReservaDto } from '../dto/create-reserva.dto';

@Injectable()
export class PrestamosService {
  constructor(
    @InjectRepository(Prestamo)
    private readonly prestamoRepository: Repository<Prestamo>,
    @InjectRepository(DetallePrestamo)
    private readonly detalleRepository: Repository<DetallePrestamo>,
    @InjectRepository(Devolucion)
    private readonly devolucionRepository: Repository<Devolucion>,
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
    @InjectRepository(HistorialPrestamo)
    private readonly historialRepository: Repository<HistorialPrestamo>,
    @InjectRepository(VwPrestamoActivo)
    private readonly vwActivosRepository: Repository<VwPrestamoActivo>,
    @InjectRepository(EdicionVolumen)
    private readonly edicionRepository: Repository<EdicionVolumen>,
    private readonly dataSource: DataSource,
  ) {}

  async createPrestamo(dto: CreatePrestamoDto) {
    const { idUsuario, fechaLimiteDevolucion, idsEdicionVolumen, fechaPrestamo } = dto;

    const ejemplares = await this.edicionRepository.findBy({ idEdicionVolumen: In(idsEdicionVolumen) });
    if (ejemplares.length !== idsEdicionVolumen.length) {
      throw new NotFoundException('One or more copies not found');
    }

    for (const ej of ejemplares) {
      if (ej.disponibilidad !== 'Disponible') {
        throw new BadRequestException(
          `Copy ${ej.codigoBarras || ej.idEdicionVolumen} is not available (${ej.disponibilidad})`,
        );
      }
    }

    for (const id of idsEdicionVolumen) {
      const otraReserva = await this.reservaRepository.findOne({
        where: { idEdicionVolumen: id, estadoReserva: 'Activa' },
      });
      if (otraReserva && otraReserva.idUsuario !== idUsuario) {
        throw new BadRequestException(`Copy ${id} is reserved by another user`);
      }
    }

    const tipoRes = await this.dataSource.query(
      `SELECT idtipousuario FROM usuarios WHERE idusuario = $1`,
      [idUsuario],
    );
    if (tipoRes.length === 0) throw new NotFoundException('User not found');
    const idTipoUsuario = tipoRes[0].idtipousuario;

    const limits: Record<number, number> = { 1: 5, 2: 10, 3: 3, 4: 15 };
    const limit = limits[idTipoUsuario] || 3;

    const activeCount = await this.dataSource.query(
      `SELECT COUNT(*) as cnt FROM detalles_prestamo dp
       JOIN prestamos p ON p.idprestamo = dp.idprestamo
       WHERE p.idusuario = $1
       AND NOT EXISTS (
         SELECT 1 FROM devoluciones d WHERE d.idedicionvolumen = dp.idedicionvolumen
         AND d.fechadevolucion >= p.fechaprestamo
       )`,
      [idUsuario],
    );
    if (parseInt(activeCount[0].cnt, 10) + idsEdicionVolumen.length > limit) {
      throw new BadRequestException(
        `Loan limit exceeded. You have ${activeCount[0].cnt} active loan(s) and the limit is ${limit}.`,
      );
    }

    return this.dataSource.transaction(async (manager) => {
      const prestamo = manager.create(Prestamo, {
        idUsuario,
        fechaPrestamo: fechaPrestamo || new Date().toISOString().split('T')[0],
        fechaLimiteDevolucion,
      });
      const saved = await manager.save(Prestamo, prestamo);

      for (const id of idsEdicionVolumen) {
        const detalle = manager.create(DetallePrestamo, {
          idPrestamo: saved.idPrestamo,
          idEdicionVolumen: id,
        });
        await manager.save(DetallePrestamo, detalle);

        await manager.update(
          Reserva,
          { idEdicionVolumen: id, idUsuario, estadoReserva: 'Activa' },
          { estadoReserva: 'Completada' },
        );
      }

      return this.findOne(saved.idPrestamo);
    });
  }

  async findAll(query: { page?: number; pageSize?: number; usuario?: number; vencido?: string }) {
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const qb = this.prestamoRepository.createQueryBuilder('p')
      .leftJoinAndSelect('p.usuario', 'u')
      .leftJoinAndSelect('u.persona', 'per')
      .leftJoinAndSelect('p.detalles', 'dp')
      .leftJoinAndSelect('dp.edicionVolumen', 'ev')
      .leftJoinAndSelect('ev.libro', 'l');

    if (query.usuario) {
      qb.andWhere('p.idusuario = :usuario', { usuario: query.usuario });
    }

    if (query.vencido === 'true') {
      qb.andWhere('p.fechalimitedevolucion < CURRENT_DATE');
    }

    qb.orderBy('p.fechaprestamo', 'DESC');

    const [data, total] = await qb.skip(skip).take(pageSize).getManyAndCount();

    return { data, meta: { total, page, pageSize } };
  }

  async findOne(id: number) {
    const prestamo = await this.prestamoRepository.findOne({
      where: { idPrestamo: id },
      relations: {
        usuario: { persona: true },
        detalles: {
          edicionVolumen: { libro: true },
        },
      },
    });
    if (!prestamo) throw new NotFoundException(`Loan with ID ${id} not found`);
    return prestamo;
  }

  async findVencidos(query: { page?: number; pageSize?: number }) {
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const [data, total] = await this.vwActivosRepository.findAndCount({
      where: { vencido: true },
      skip,
      take: pageSize,
    });

    return { data, meta: { total, page, pageSize } };
  }

  async createDevolucion(dto: CreateDevolucionDto) {
    const ejemplar = await this.edicionRepository.findOne({
      where: { idEdicionVolumen: dto.idEdicionVolumen },
    });
    if (!ejemplar) throw new NotFoundException('Copy not found');
    if (ejemplar.disponibilidad !== 'Prestado') {
      throw new BadRequestException('Copy is not currently on loan');
    }

    const devolucion = this.devolucionRepository.create({
      idEdicionVolumen: dto.idEdicionVolumen,
      fechaDevolucion: dto.fechaDevolucion || new Date().toISOString().split('T')[0],
      ...(dto.estadoEntrega ? { estadoEntrega: dto.estadoEntrega } : {}),
    });

    return this.devolucionRepository.save(devolucion);
  }

  async createReserva(dto: CreateReservaDto) {
    const ejemplar = await this.edicionRepository.findOne({
      where: { idEdicionVolumen: dto.idEdicionVolumen },
    });
    if (!ejemplar) throw new NotFoundException('Copy not found');
    if (ejemplar.disponibilidad !== 'Disponible') {
      throw new BadRequestException('Copy is not available for reservation');
    }

    const existing = await this.reservaRepository.findOne({
      where: {
        idEdicionVolumen: dto.idEdicionVolumen,
        idUsuario: dto.idUsuario,
        estadoReserva: 'Activa',
      },
    });
    if (existing) throw new BadRequestException('You already have an active reservation for this copy');

    const reserva = this.reservaRepository.create({
      idUsuario: dto.idUsuario,
      idEdicionVolumen: dto.idEdicionVolumen,
      estadoReserva: 'Activa',
    });

    return this.reservaRepository.save(reserva);
  }

  async findReservas(query: { page?: number; pageSize?: number; usuario?: number }) {
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const where: any = {};
    if (query.usuario) where.idUsuario = query.usuario;

    const [data, total] = await this.reservaRepository.findAndCount({
      where,
      relations: { edicionVolumen: { libro: true }, usuario: { persona: true } },
      skip,
      take: pageSize,
      order: { fechaReserva: 'DESC' },
    });

    return { data, meta: { total, page, pageSize } };
  }

  async cancelReserva(id: number) {
    const reserva = await this.reservaRepository.findOne({ where: { idReserva: id } });
    if (!reserva) throw new NotFoundException('Reservation not found');
    reserva.estadoReserva = 'Cancelada';
    return this.reservaRepository.save(reserva);
  }

  async findHistorial(idUsuario: number, query: { page?: number; pageSize?: number }) {
    const page = Number(query.page) || 1;
    const pageSize = Number(query.pageSize) || 10;
    const skip = (page - 1) * pageSize;

    const [data, total] = await this.historialRepository.findAndCount({
      where: { idUsuario },
      relations: { edicionVolumen: { libro: true } },
      skip,
      take: pageSize,
      order: { fechaPrestamo: 'DESC' },
    });

    return { data, meta: { total, page, pageSize } };
  }
}
