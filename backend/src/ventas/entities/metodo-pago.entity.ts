import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'metodos_pago' })
export class MetodoPago {
  @PrimaryGeneratedColumn({ name: 'idmetodopago' })
  idMetodoPago: number;

  @Column({ name: 'nombremetodo', length: 80 })
  nombreMetodo: string;
}
