export interface Evento {
  idEvento: number;
  nombreEvento: string;
  descripcion?: string;
  fechaEvento: string;
  capacidadMaxima?: number;
  lugar?: string;
}

export interface EventoConCupo extends Evento {
  inscritos?: number;
  cuposDisponibles?: number;
}

export interface AsistenciaEvento {
  idAsistencia: number;
  idEvento: number;
  idUsuario: number;
  fechaRegistro: string;
  asistencia: string;
  evento?: Evento;
  usuario?: { idUsuario: number; persona?: { pNombre: string; pApellido: string } };
}

export interface CreateEventoRequest {
  nombreEvento: string;
  fechaEvento: string;
  descripcion?: string;
  capacidadMaxima?: number;
  lugar?: string;
}

export type UpdateEventoRequest = Partial<CreateEventoRequest>;

export interface MarcarAsistenciaRequest {
  asistencia: 'Sí' | 'No' | 'Pendiente';
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; pageSize: number };
}
