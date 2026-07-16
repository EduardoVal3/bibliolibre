export interface Idioma {
  idIdioma: number;
  nombreIdioma: string;
}

export interface Editorial {
  idEditorial: number;
  nombre: string;
  pais?: string;
  contacto?: string;
}

export interface Categoria {
  idCategoria: number;
  nombreCategoria: string;
  descripcion?: string;
}

export interface Autor {
  idAutor: number;
  nombre: string;
  nacionalidad?: string;
  biografia?: string;
}

export interface PalabraClave {
  idPalabraClave: number;
  palabra: string;
}

export interface UbicacionFisica {
  idUbicacion: number;
  seccion?: string;
  pasillo?: string;
  estanteria?: string;
}

export interface EdicionVolumen {
  idEdicionVolumen: number;
  codigoBarras?: string;
  estadoFisico?: string;
  disponibilidad?: string;
  idLibro: number;
  idUbicacion?: number;
  ubicacion?: UbicacionFisica;
}

export interface Libro {
  idLibro: number;
  titulo: string;
  isbn?: string;
  anioPublicacion?: number;
  edicion?: string;
  idEditorial: number;
  idCategoria: number;
  idIdioma: number;
  editorial?: Editorial;
  categoria?: Categoria;
  idioma?: Idioma;
  autores?: Autor[];
  palabrasClave?: PalabraClave[];
  ejemplares?: EdicionVolumen[];
}

export interface VwCatalogoLibro {
  idLibro: number;
  titulo: string;
  isbn: string;
  anioPublicacion: number;
  edicion: string;
  editorial: string;
  categoria: string;
  idioma: string;
  autores: string;
  totalEjemplares: string | number;
  ejemplaresDisponibles: string | number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
}
