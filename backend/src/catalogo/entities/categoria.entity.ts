import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'categorias' })
export class Categoria {
  @PrimaryGeneratedColumn({ name: 'idcategoria' })
  idCategoria: number;

  @Column({ name: 'nombrecategoria', length: 100 })
  nombreCategoria: string;

  @Column({ name: 'descripcion', type: 'text', nullable: true })
  descripcion: string;
}
