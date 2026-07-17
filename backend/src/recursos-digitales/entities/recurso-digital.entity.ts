import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'recursos_digitales' })
export class RecursoDigital {
  @PrimaryGeneratedColumn({ name: 'idrecurso' })
  idRecurso: number;

  @Column({ name: 'titulo', length: 255 })
  titulo: string;

  @Column({ name: 'tiporecurso', length: 80, nullable: true })
  tipoRecurso: string;

  @Column({ name: 'formato', length: 50, nullable: true })
  formato: string;

  @Column({ name: 'urlacceso', type: 'text', nullable: true })
  urlAcceso: string;
}
