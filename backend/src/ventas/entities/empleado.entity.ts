import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Persona } from '../../usuarios/entities/persona.entity';
import { RolEmpleado } from './rol-empleado.entity';
import { Turno } from './turno.entity';

@Entity({ name: 'empleados' })
export class Empleado {
  @PrimaryGeneratedColumn({ name: 'idempleado' })
  idEmpleado: number;

  @Column({ name: 'fechacontratacion', type: 'date', nullable: true })
  fechaContratacion: string;

  @Column({ name: 'idpersona' })
  idPersona: number;

  @Column({ name: 'idrol' })
  idRol: number;

  @Column({ name: 'idturno', nullable: true })
  idTurno: number;

  @ManyToOne(() => Persona)
  @JoinColumn({ name: 'idpersona' })
  persona: Persona;

  @ManyToOne(() => RolEmpleado)
  @JoinColumn({ name: 'idrol' })
  rol: RolEmpleado;

  @ManyToOne(() => Turno)
  @JoinColumn({ name: 'idturno' })
  turno: Turno;
}
