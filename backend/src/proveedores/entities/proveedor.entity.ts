import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'proveedores' })
export class Proveedor {
  @PrimaryGeneratedColumn({ name: 'idproveedor' })
  idProveedor: number;

  @Column({ name: 'nombreempresa', length: 150 })
  nombreEmpresa: string;

  @Column({ name: 'contacto', length: 100, nullable: true })
  contacto: string;

  @Column({ name: 'telefono', length: 20, nullable: true })
  telefono: string;

  @Column({ name: 'correo', length: 150, nullable: true })
  correo: string;
}
