import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { DispositivoPrestado } from './dispositivo-prestado.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity({ name: 'prestamos_dispositivos' })
export class PrestamoDispositivo {
  @PrimaryGeneratedColumn({ name: 'idprestamodispositivo' })
  idPrestamoDispositivo: number;

  @Column({ name: 'iddispositivo' })
  idDispositivo: number;

  @Column({ name: 'idusuario' })
  idUsuario: number;

  @Column({ name: 'fechaprestamo', type: 'date' })
  fechaPrestamo: string;

  @Column({ name: 'fechalimitedevolucion', type: 'date', nullable: true })
  fechaLimiteDevolucion: string;

  @Column({ name: 'fechadevolucion', type: 'date', nullable: true })
  fechaDevolucion: string;

  @ManyToOne(() => DispositivoPrestado, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'iddispositivo' })
  dispositivo: DispositivoPrestado;

  @ManyToOne(() => Usuario, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'idusuario' })
  usuario: Usuario;
}
