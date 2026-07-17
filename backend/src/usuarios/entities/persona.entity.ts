import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'persona' })
export class Persona {
  @PrimaryGeneratedColumn({ name: 'idpersona' })
  idPersona: number;

  @Column({ name: 'pnombre', length: 80 })
  pNombre: string;

  @Column({ name: 'snombre', length: 80, nullable: true })
  sNombre: string;

  @Column({ name: 'papellido', length: 80 })
  pApellido: string;

  @Column({ name: 'sapellido', length: 80, nullable: true })
  sApellido: string;

  @Column({ name: 'correo', length: 150, unique: true })
  correo: string;

  @Column({ name: 'telefono', length: 20, nullable: true })
  telefono: string;

  @Column({ name: 'direccion', type: 'text', nullable: true })
  direccion: string;
}
