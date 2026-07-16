import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'autores' })
export class Autor {
  @PrimaryGeneratedColumn({ name: 'idautor' })
  idAutor: number;

  @Column({ name: 'nombre', length: 150 })
  nombre: string;

  @Column({ name: 'nacionalidad', length: 80, nullable: true })
  nacionalidad: string;

  @Column({ name: 'biografia', type: 'text', nullable: true })
  biografia: string;
}
