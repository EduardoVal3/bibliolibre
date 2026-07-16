import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'editoriales' })
export class Editorial {
  @PrimaryGeneratedColumn({ name: 'ideditorial' })
  idEditorial: number;

  @Column({ name: 'nombre', length: 150 })
  nombre: string;

  @Column({ name: 'pais', length: 80, nullable: true })
  pais: string;

  @Column({ name: 'contacto', length: 100, nullable: true })
  contacto: string;
}
