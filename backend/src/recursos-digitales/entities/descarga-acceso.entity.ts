import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { RecursoDigital } from './recurso-digital.entity';

@Entity({ name: 'descargas_accesos' })
export class DescargaAcceso {
  @PrimaryGeneratedColumn({ name: 'iddescarga' })
  idDescarga: number;

  @Column({ name: 'fechaacceso', type: 'timestamp' })
  fechaAcceso: string;

  @Column({ name: 'tipoaccion', length: 50, nullable: true })
  tipoAccion: string;

  @Column({ name: 'idusuario' })
  idUsuario: number;

  @Column({ name: 'idrecurso' })
  idRecurso: number;

  @ManyToOne(() => Usuario, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idusuario' })
  usuario: Usuario;

  @ManyToOne(() => RecursoDigital, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idrecurso' })
  recurso: RecursoDigital;
}
