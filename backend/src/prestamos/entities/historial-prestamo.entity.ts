import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { EdicionVolumen } from '../../catalogo/entities/edicion-volumen.entity';

@Entity({ name: 'historial_prestamos' })
export class HistorialPrestamo {
  @PrimaryGeneratedColumn({ name: 'idhistorial' })
  idHistorial: number;

  @Column({ name: 'idusuario' })
  idUsuario: number;

  @Column({ name: 'idedicionvolumen' })
  idEdicionVolumen: number;

  @Column({ name: 'fechaprestamo', type: 'date' })
  fechaPrestamo: string;

  @Column({ name: 'fechadevolucion', type: 'date', nullable: true })
  fechaDevolucion: string;

  @ManyToOne(() => Usuario, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idusuario' })
  usuario: Usuario;

  @ManyToOne(() => EdicionVolumen, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idedicionvolumen' })
  edicionVolumen: EdicionVolumen;
}
