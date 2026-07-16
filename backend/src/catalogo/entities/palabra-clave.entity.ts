import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'palabras_clave' })
export class PalabraClave {
  @PrimaryGeneratedColumn({ name: 'idpalabraclave' })
  idPalabraClave: number;

  @Column({ name: 'palabra', length: 100, unique: true })
  palabra: string;
}
