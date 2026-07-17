import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { RolEmpleado } from './rol-empleado.entity';
import { Permiso } from './permiso.entity';

@Entity({ name: 'rol_permiso' })
export class RolPermiso {
  @PrimaryGeneratedColumn({ name: 'idrolpermiso' })
  idRolPermiso: number;

  @Column({ name: 'idrol' })
  idRol: number;

  @Column({ name: 'idpermiso' })
  idPermiso: number;

  @ManyToOne(() => RolEmpleado)
  @JoinColumn({ name: 'idrol' })
  rol: RolEmpleado;

  @ManyToOne(() => Permiso)
  @JoinColumn({ name: 'idpermiso' })
  permiso: Permiso;
}
