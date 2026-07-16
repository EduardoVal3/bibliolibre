import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Editorial } from './editorial.entity';
import { Categoria } from './categoria.entity';
import { Idioma } from './idioma.entity';
import { Autor } from './autor.entity';
import { PalabraClave } from './palabra-clave.entity';
import { EdicionVolumen } from './edicion-volumen.entity';

@Entity({ name: 'libros' })
export class Libro {
  @PrimaryGeneratedColumn({ name: 'idlibro' })
  idLibro: number;

  @Column({ name: 'titulo', length: 255 })
  titulo: string;

  @Column({ name: 'isbn', length: 20, unique: true, nullable: true })
  isbn: string;

  @Column({ name: 'aniopublicacion', nullable: true })
  anioPublicacion: number;

  @Column({ name: 'edicion', length: 50, nullable: true })
  edicion: string;

  @Column({ name: 'ideditorial' })
  idEditorial: number;

  @Column({ name: 'idcategoria' })
  idCategoria: number;

  @Column({ name: 'ididioma' })
  idIdioma: number;

  @ManyToOne(() => Editorial, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'ideditorial' })
  editorial: Editorial;

  @ManyToOne(() => Categoria, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idcategoria' })
  categoria: Categoria;

  @ManyToOne(() => Idioma, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'ididioma' })
  idioma: Idioma;

  @ManyToMany(() => Autor)
  @JoinTable({
    name: 'libro_autor',
    joinColumn: { name: 'idlibro', referencedColumnName: 'idLibro' },
    inverseJoinColumn: { name: 'idautor', referencedColumnName: 'idAutor' },
  })
  autores: Autor[];

  @ManyToMany(() => PalabraClave)
  @JoinTable({
    name: 'libro_palabra_clave',
    joinColumn: { name: 'idlibro', referencedColumnName: 'idLibro' },
    inverseJoinColumn: { name: 'idpalabraclave', referencedColumnName: 'idPalabraClave' },
  })
  palabrasClave: PalabraClave[];

  @OneToMany(() => EdicionVolumen, (ev) => ev.libro)
  ejemplares: EdicionVolumen[];
}
