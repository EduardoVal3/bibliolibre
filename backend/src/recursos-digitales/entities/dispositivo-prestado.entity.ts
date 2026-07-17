import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'dispositivos_prestados' })
export class DispositivoPrestado {
  @PrimaryGeneratedColumn({ name: 'iddispositivo' })
  idDispositivo: number;

  @Column({ name: 'nombredispositivo', length: 100 })
  nombreDispositivo: string;

  @Column({ name: 'tipodispositivo', length: 80, nullable: true })
  tipoDispositivo: string;

  @Column({ name: 'numeroserie', length: 80, unique: true, nullable: true })
  numeroSerie: string;

  @Column({ name: 'estado', length: 50, nullable: true })
  estado: string;
}
