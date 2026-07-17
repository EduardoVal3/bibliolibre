import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Persona } from './persona.entity';
import { TipoUsuario } from './tipo-usuario.entity';

@Entity({ name: 'usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'idusuario' })
  idUsuario: number;

  @Column({ name: 'passwordhash', length: 255 })
  passwordHash: string;

  @Column({ name: 'fecharegistro', type: 'date', default: () => 'CURRENT_DATE' })
  fechaRegistro: string;

  @Column({ name: 'idpersona' })
  idPersona: number;

  @Column({ name: 'idtipousuario' })
  idTipoUsuario: number;

  @OneToOne(() => Persona, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idpersona' })
  persona: Persona;

  @ManyToOne(() => TipoUsuario, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idtipousuario' })
  tipoUsuario: TipoUsuario;
}
