import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  name: 'vw_catalogo_libros',
  synchronize: false,
})
export class VwCatalogoLibro {
  @ViewColumn({ name: 'idlibro' })
  idLibro: number;

  @ViewColumn({ name: 'titulo' })
  titulo: string;

  @ViewColumn({ name: 'isbn' })
  isbn: string;

  @ViewColumn({ name: 'aniopublicacion' })
  anioPublicacion: number;

  @ViewColumn({ name: 'edicion' })
  edicion: string;

  @ViewColumn({ name: 'editorial' })
  editorial: string;

  @ViewColumn({ name: 'categoria' })
  categoria: string;

  @ViewColumn({ name: 'idioma' })
  idioma: string;

  @ViewColumn({ name: 'autores' })
  autores: string;

  @ViewColumn({ name: 'total_ejemplares' })
  totalEjemplares: number;

  @ViewColumn({ name: 'ejemplares_disponibles' })
  ejemplaresDisponibles: number;
}
