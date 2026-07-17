import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Proveedor } from './proveedor.entity';
import { Presupuesto } from './presupuesto.entity';
import { DetalleOrden } from './detalle-orden.entity';

@Entity({ name: 'ordenes_compra' })
export class OrdenCompra {
  @PrimaryGeneratedColumn({ name: 'idordencompra' })
  idOrdenCompra: number;

  @Column({ name: 'fechaorden', type: 'date' })
  fechaOrden: string;

  @Column({ name: 'totalorden', type: 'decimal', precision: 12, scale: 2 })
  totalOrden: number;

  @Column({ name: 'idproveedor' })
  idProveedor: number;

  @Column({ name: 'idpresupuesto', nullable: true })
  idPresupuesto: number;

  @ManyToOne(() => Proveedor, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idproveedor' })
  proveedor: Proveedor;

  @ManyToOne(() => Presupuesto, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'idpresupuesto' })
  presupuesto: Presupuesto;

  @OneToMany(() => DetalleOrden, (detalle) => detalle.ordenCompra, { cascade: true })
  detalles: DetalleOrden[];
}
