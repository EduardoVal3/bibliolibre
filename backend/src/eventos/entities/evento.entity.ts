import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'eventos' })
export class Evento {
  @PrimaryGeneratedColumn({ name: 'idevento' })
  idEvento: number;

  @Column({ name: 'nombreevento', length: 150 })
  nombreEvento: string;

  @Column({ name: 'descripcion', type: 'text', nullable: true })
  descripcion: string;

  @Column({ name: 'fechaevento', type: 'date' })
  fechaEvento: string;

  @Column({ name: 'capacidadmaxima', nullable: true })
  capacidadMaxima: number;

  @Column({ name: 'lugar', length: 150, nullable: true })
  lugar: string;
}
