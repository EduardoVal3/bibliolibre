import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'permisos' })
export class Permiso {
  @PrimaryGeneratedColumn({ name: 'idpermiso' })
  idPermiso: number;

  @Column({ name: 'nombrepermiso', length: 100 })
  nombrePermiso: string;

  @Column({ name: 'descripcion', type: 'text', nullable: true })
  descripcion: string;
}
