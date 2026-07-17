import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { EdicionVolumen } from '../../catalogo/entities/edicion-volumen.entity';

@Entity({ name: 'devoluciones' })
export class Devolucion {
  @PrimaryGeneratedColumn({ name: 'iddevolucion' })
  idDevolucion: number;

  @Column({ name: 'fechadevolucion', type: 'date', default: () => 'CURRENT_DATE' })
  fechaDevolucion: string;

  @Column({ name: 'estadoentrega', length: 50, nullable: true })
  estadoEntrega: string;

  @Column({ name: 'idedicionvolumen' })
  idEdicionVolumen: number;

  @ManyToOne(() => EdicionVolumen, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idedicionvolumen' })
  edicionVolumen: EdicionVolumen;
}
