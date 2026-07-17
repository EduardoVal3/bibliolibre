import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'presupuestos' })
export class Presupuesto {
  @PrimaryGeneratedColumn({ name: 'idpresupuesto' })
  idPresupuesto: number;

  @Column({ name: 'anio' })
  anio: number;

  @Column({ name: 'montoasignado', type: 'decimal', precision: 12, scale: 2 })
  montoAsignado: number;
}
