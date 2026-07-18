import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Membresia } from './membresia.entity';

@Entity({ name: 'pagos_membresias' })
export class PagoMembresia {
  @PrimaryGeneratedColumn({ name: 'idpagomembresia' })
  idPagoMembresia: number;

  @Column({ name: 'idusuario' })
  idUsuario: number;

  @Column({ name: 'idmembresia' })
  idMembresia: number;

  @Column({ name: 'proveedor', length: 30, default: 'PayPal' })
  proveedor: string;

  @Column({ name: 'idordenexterna', length: 100 })
  idOrdenExterna: string;

  @Column({ name: 'monto', type: 'numeric', precision: 10, scale: 2 })
  monto: number;

  @Column({ name: 'moneda', length: 10, default: 'USD' })
  moneda: string;

  @Column({ name: 'estado', length: 20, default: 'Pendiente' })
  estado: string;

  @Column({ name: 'fechacreacion', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion: string;

  @Column({ name: 'fechaconfirmacion', type: 'timestamp', nullable: true })
  fechaConfirmacion: string;

  @ManyToOne(() => Usuario, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idusuario' })
  usuario: Usuario;

  @ManyToOne(() => Membresia, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idmembresia' })
  membresia: Membresia;
}
