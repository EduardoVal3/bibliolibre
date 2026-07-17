import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Empleado } from './empleado.entity';
import { DetalleVenta } from './detalle-venta.entity';
import { PagoVenta } from './pago-venta.entity';

@Entity({ name: 'ventas' })
export class Venta {
  @PrimaryGeneratedColumn({ name: 'idventa' })
  idVenta: number;

  @Column({ name: 'fechaventa', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaVenta: Date;

  @Column({ name: 'idusuario', nullable: true })
  idUsuario: number;

  @Column({ name: 'idempleado' })
  idEmpleado: number;

  @Column({ name: 'total', type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'idusuario' })
  usuario: Usuario;

  @ManyToOne(() => Empleado)
  @JoinColumn({ name: 'idempleado' })
  empleado: Empleado;

  @OneToMany(() => DetalleVenta, (d) => d.venta)
  detalles: DetalleVenta[];

  @OneToMany(() => PagoVenta, (p) => p.venta)
  pagos: PagoVenta[];
}
