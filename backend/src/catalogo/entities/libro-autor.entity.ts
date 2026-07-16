import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Libro } from './libro.entity';
import { Autor } from './autor.entity';

@Entity({ name: 'libro_autor' })
export class LibroAutor {
  @PrimaryGeneratedColumn({ name: 'idlibroautor' })
  idLibroAutor: number;

  @Column({ name: 'idlibro' })
  idLibro: number;

  @Column({ name: 'idautor' })
  idAutor: number;

  @ManyToOne(() => Libro, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idlibro' })
  libro: Libro;

  @ManyToOne(() => Autor, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idautor' })
  autor: Autor;
}
