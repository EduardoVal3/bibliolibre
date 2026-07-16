import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Libro } from './libro.entity';
import { PalabraClave } from './palabra-clave.entity';

@Entity({ name: 'libro_palabra_clave' })
export class LibroPalabraClave {
  @PrimaryGeneratedColumn({ name: 'idlibropalabra' })
  idLibroPalabra: number;

  @Column({ name: 'idlibro' })
  idLibro: number;

  @Column({ name: 'idpalabraclave' })
  idPalabraClave: number;

  @ManyToOne(() => Libro, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idlibro' })
  libro: Libro;

  @ManyToOne(() => PalabraClave, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idpalabraclave' })
  palabraClave: PalabraClave;
}
