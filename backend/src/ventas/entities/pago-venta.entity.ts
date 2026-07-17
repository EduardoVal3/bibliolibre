import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Venta } from './venta.entity';
import { MetodoPago } from './metodo-pago.entity';

@Entity({ name: 'pagos_ventas' })
export class PagoVenta {
  @PrimaryGeneratedColumn({ name: 'idpagoventa' })
  idPagoVenta: number;

  @Column({ name: 'idventa' })
  idVenta: number;

  @Column({ name: 'idmetodopago' })
  idMetodoPago: number;

  @Column({ name: 'monto', type: 'decimal', precision: 10, scale: 2 })
  monto: number;

  @ManyToOne(() => Venta, (v) => v.pagos)
  @JoinColumn({ name: 'idventa' })
  venta: Venta;

  @ManyToOne(() => MetodoPago)
  @JoinColumn({ name: 'idmetodopago' })
  metodoPago: MetodoPago;
}
