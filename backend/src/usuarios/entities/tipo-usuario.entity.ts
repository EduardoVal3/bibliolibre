import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'tipos_usuario' })
export class TipoUsuario {
  @PrimaryGeneratedColumn({ name: 'idtipousuario' })
  idTipoUsuario: number;

  @Column({ name: 'nombretipo', length: 80 })
  nombreTipo: string;

  @Column({ name: 'descripcion', type: 'text', nullable: true })
  descripcion: string;
}
