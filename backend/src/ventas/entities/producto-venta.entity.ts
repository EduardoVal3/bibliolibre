import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'productos_venta' })
export class ProductoVenta {
  @PrimaryGeneratedColumn({ name: 'idproducto' })
  idProducto: number;

  @Column({ name: 'nombre', length: 150 })
  nombre: string;

  @Column({ name: 'descripcion', type: 'text', nullable: true })
  descripcion: string;

  @Column({ name: 'precio', type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ name: 'stockdisponible' })
  stockDisponible: number;
}
