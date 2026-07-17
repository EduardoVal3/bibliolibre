import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { DetallePrestamo } from './detalle-prestamo.entity';

@Entity({ name: 'prestamos' })
export class Prestamo {
  @PrimaryGeneratedColumn({ name: 'idprestamo' })
  idPrestamo: number;

  @Column({ name: 'fechaprestamo', type: 'date', default: () => 'CURRENT_DATE' })
  fechaPrestamo: string;

  @Column({ name: 'fechalimitedevolucion', type: 'date' })
  fechaLimiteDevolucion: string;

  @Column({ name: 'idusuario' })
  idUsuario: number;

  @ManyToOne(() => Usuario, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idusuario' })
  usuario: Usuario;

  @OneToMany(() => DetallePrestamo, (dp) => dp.prestamo)
  detalles: DetallePrestamo[];
}
