import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Venta } from './venta.entity';
import { ProductoVenta } from './producto-venta.entity';

@Entity({ name: 'detalles_venta' })
export class DetalleVenta {
  @PrimaryGeneratedColumn({ name: 'iddetalleventa' })
  idDetalleVenta: number;

  @Column({ name: 'idventa' })
  idVenta: number;

  @Column({ name: 'idproducto' })
  idProducto: number;

  @Column({ name: 'cantidad' })
  cantidad: number;

  @Column({ name: 'preciounitario', type: 'decimal', precision: 10, scale: 2 })
  precioUnitario: number;

  @Column({ name: 'subtotal', type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  @ManyToOne(() => Venta, (v) => v.detalles)
  @JoinColumn({ name: 'idventa' })
  venta: Venta;

  @ManyToOne(() => ProductoVenta)
  @JoinColumn({ name: 'idproducto' })
  producto: ProductoVenta;
}
