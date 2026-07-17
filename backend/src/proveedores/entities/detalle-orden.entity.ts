import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { OrdenCompra } from './orden-compra.entity';

@Entity({ name: 'detalles_orden' })
export class DetalleOrden {
  @PrimaryGeneratedColumn({ name: 'iddetalleorden' })
  idDetalleOrden: number;

  @Column({ name: 'idordencompra' })
  idOrdenCompra: number;

  @Column({ name: 'cantidad' })
  cantidad: number;

  @Column({ name: 'preciounitario', type: 'decimal', precision: 10, scale: 2 })
  precioUnitario: number;

  @ManyToOne(() => OrdenCompra, (oc) => oc.detalles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idordencompra' })
  ordenCompra: OrdenCompra;
}
