import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'idiomas' })
export class Idioma {
  @PrimaryGeneratedColumn({ name: 'ididioma' })
  idIdioma: number;

  @Column({ name: 'nombreidioma', length: 50 })
  nombreIdioma: string;
}
