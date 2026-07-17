import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Prestamo } from './prestamo.entity';
import { EdicionVolumen } from '../../catalogo/entities/edicion-volumen.entity';

@Entity({ name: 'detalles_prestamo' })
export class DetallePrestamo {
  @PrimaryGeneratedColumn({ name: 'iddetalleprestamo' })
  idDetallePrestamo: number;

  @Column({ name: 'idprestamo' })
  idPrestamo: number;

  @Column({ name: 'idedicionvolumen' })
  idEdicionVolumen: number;

  @ManyToOne(() => Prestamo, (p) => p.detalles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idprestamo' })
  prestamo: Prestamo;

  @ManyToOne(() => EdicionVolumen, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idedicionvolumen' })
  edicionVolumen: EdicionVolumen;
}
