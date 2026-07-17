export interface RecursoDigital {
  idRecurso: number;
  titulo: string;
  tipoRecurso?: string;
  formato?: string;
  urlAcceso?: string;
}

export interface DescargaAcceso {
  idDescarga: number;
  fechaAcceso: string;
  tipoAccion: string;
  idUsuario: number;
  idRecurso: number;
  recurso?: RecursoDigital;
}

export interface DispositivoPrestado {
  idDispositivo: number;
  nombreDispositivo: string;
  tipoDispositivo?: string;
  numeroSerie?: string;
  estado?: string;
}

export interface PrestamoDispositivo {
  idPrestamoDispositivo: number;
  idDispositivo: number;
  idUsuario: number;
  fechaPrestamo: string;
  fechaLimiteDevolucion?: string;
  fechaDevolucion?: string;
  dispositivo?: DispositivoPrestado;
  usuario?: { idUsuario: number; persona?: { pnombre: string; papellido: string } };
}

export interface VwRecursosMasDescargados {
  idRecurso: number;
  titulo: string;
  tipoRecurso: string;
  totalDescargas: number;
  totalVisualizaciones: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; pageSize: number };
}
