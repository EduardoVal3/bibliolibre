import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Evento } from './evento.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity({ name: 'asistencias_eventos' })
export class AsistenciaEvento {
  @PrimaryGeneratedColumn({ name: 'idasistencia' })
  idAsistencia: number;

  @Column({ name: 'idevento' })
  idEvento: number;

  @Column({ name: 'idusuario' })
  idUsuario: number;

  @Column({ name: 'fecharegistro', type: 'date' })
  fechaRegistro: string;

  @Column({ name: 'asistencia', length: 20, nullable: true })
  asistencia: string;

  @ManyToOne(() => Evento, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idevento' })
  evento: Evento;

  @ManyToOne(() => Usuario, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idusuario' })
  usuario: Usuario;
}
