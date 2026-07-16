import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'ubicaciones_fisicas' })
export class UbicacionFisica {
  @PrimaryGeneratedColumn({ name: 'idubicacion' })
  idUbicacion: number;

  @Column({ name: 'seccion', length: 50, nullable: true })
  seccion: string;

  @Column({ name: 'pasillo', length: 50, nullable: true })
  pasillo: string;

  @Column({ name: 'estanteria', length: 50, nullable: true })
  estanteria: string;
}
