import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Libro } from './libro.entity';
import { UbicacionFisica } from './ubicacion-fisica.entity';

@Entity({ name: 'edicion_volumen' })
export class EdicionVolumen {
  @PrimaryGeneratedColumn({ name: 'idedicionvolumen' })
  idEdicionVolumen: number;

  @Column({ name: 'codigobarras', length: 50, unique: true, nullable: true })
  codigoBarras: string;

  @Column({ name: 'estadofisico', length: 50, nullable: true })
  estadoFisico: string;

  @Column({ name: 'disponibilidad', length: 30, nullable: true })
  disponibilidad: string;

  @Column({ name: 'idlibro' })
  idLibro: number;

  @Column({ name: 'idubicacion', nullable: true })
  idUbicacion: number;

  @ManyToOne(() => Libro, (libro) => libro.ejemplares, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idlibro' })
  libro: Libro;

  @ManyToOne(() => UbicacionFisica, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'idubicacion' })
  ubicacion: UbicacionFisica;
}
