export interface LoginRequest {
  correo: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  usuario: {
    sub: number;
    idPersona: number;
    idTipoUsuario: number;
    correo: string;
    idRol?: number;
    permisos?: string[];
  };
}

export interface RegistroRequest {
  pNombre: string;
  sNombre?: string;
  pApellido: string;
  sApellido?: string;
  correo: string;
  telefono?: string;
  direccion?: string;
  password: string;
  idTipoUsuario: number;
  idMembresia: number;
}

export interface TipoUsuario {
  idTipoUsuario: number;
  nombreTipo: string;
  descripcion?: string;
}

export interface Persona {
  idPersona: number;
  pNombre: string;
  sNombre?: string;
  pApellido: string;
  sApellido?: string;
  correo: string;
  telefono?: string;
  direccion?: string;
}

export interface Usuario {
  idUsuario: number;
  passwordHash: string;
  fechaRegistro: string;
  idPersona: number;
  idTipoUsuario: number;
  persona?: Persona;
  tipoUsuario?: TipoUsuario;
}

export interface VwUsuarioCompleto {
  idUsuario: number;
  nombreCompleto: string;
  correo: string;
  telefono: string;
  tipoUsuario: string;
  fechaRegistro: string;
  nombreMembresia: string;
  membresiaVence: string;
}

export interface Membresia {
  idMembresia: number;
  nombreMembresia: string;
  descripcion?: string;
  costo?: string;
  duracionMeses?: number;
}

export interface HistorialMembresia {
  idHistorialMembresia: number;
  idUsuario: number;
  idMembresia: number;
  fechaInicio: string;
  fechaFin?: string;
  membresia?: Membresia;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    pageSize: number;
  };
}
