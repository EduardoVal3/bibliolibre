import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'turnos' })
export class Turno {
  @PrimaryGeneratedColumn({ name: 'idturno' })
  idTurno: number;

  @Column({ name: 'nombreturno', length: 80 })
  nombreTurno: string;

  @Column({ name: 'horainicio', type: 'time' })
  horaInicio: string;

  @Column({ name: 'horafin', type: 'time' })
  horaFin: string;
}
