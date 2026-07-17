import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { EdicionVolumen } from '../../catalogo/entities/edicion-volumen.entity';

@Entity({ name: 'reservas' })
export class Reserva {
  @PrimaryGeneratedColumn({ name: 'idreserva' })
  idReserva: number;

  @Column({ name: 'fechareserva', type: 'date', default: () => 'CURRENT_DATE' })
  fechaReserva: string;

  @Column({ name: 'estadoreserva', length: 50, nullable: true })
  estadoReserva: string;

  @Column({ name: 'idusuario' })
  idUsuario: number;

  @Column({ name: 'idedicionvolumen' })
  idEdicionVolumen: number;

  @ManyToOne(() => Usuario, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idusuario' })
  usuario: Usuario;

  @ManyToOne(() => EdicionVolumen, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idedicionvolumen' })
  edicionVolumen: EdicionVolumen;
}
