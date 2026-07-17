import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'roles_empleado' })
export class RolEmpleado {
  @PrimaryGeneratedColumn({ name: 'idrol' })
  idRol: number;

  @Column({ name: 'nombrerol', length: 80 })
  nombreRol: string;

  @Column({ name: 'descripcion', type: 'text', nullable: true })
  descripcion: string;
}
