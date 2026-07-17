import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'membresias' })
export class Membresia {
  @PrimaryGeneratedColumn({ name: 'idmembresia' })
  idMembresia: number;

  @Column({ name: 'nombremembresia', length: 100 })
  nombreMembresia: string;

  @Column({ name: 'descripcion', type: 'text', nullable: true })
  descripcion: string;

  @Column({ name: 'costo', type: 'numeric', precision: 10, scale: 2, nullable: true })
  costo: number;

  @Column({ name: 'duracionmeses', nullable: true })
  duracionMeses: number;
}
