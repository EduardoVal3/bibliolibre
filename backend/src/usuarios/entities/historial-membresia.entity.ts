import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from './usuario.entity';
import { Membresia } from './membresia.entity';

@Entity({ name: 'historial_membresias' })
export class HistorialMembresia {
  @PrimaryGeneratedColumn({ name: 'idhistorialmembresia' })
  idHistorialMembresia: number;

  @Column({ name: 'idusuario' })
  idUsuario: number;

  @Column({ name: 'idmembresia' })
  idMembresia: number;

  @Column({ name: 'fechainicio', type: 'date' })
  fechaInicio: string;

  @Column({ name: 'fechafin', type: 'date', nullable: true })
  fechaFin: string;

  @ManyToOne(() => Usuario, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idusuario' })
  usuario: Usuario;

  @ManyToOne(() => Membresia, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idmembresia' })
  membresia: Membresia;
}
