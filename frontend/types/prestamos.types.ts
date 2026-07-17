export interface Prestamo {
  idPrestamo: number;
  fechaPrestamo: string;
  fechaLimiteDevolucion: string;
  idUsuario: number;
  usuario?: { idUsuario: number; persona?: { pNombre: string; pApellido: string } };
  detalles?: DetallePrestamo[];
}

export interface DetallePrestamo {
  idDetallePrestamo: number;
  idPrestamo: number;
  idEdicionVolumen: number;
  edicionVolumen?: { idEdicionVolumen: number; codigoBarras?: string; libro?: { idLibro: number; titulo: string } };
}

export interface Devolucion {
  idDevolucion: number;
  fechaDevolucion: string;
  estadoEntrega?: string;
  idEdicionVolumen: number;
}

export interface Reserva {
  idReserva: number;
  fechaReserva: string;
  estadoReserva?: string;
  idUsuario: number;
  idEdicionVolumen: number;
  usuario?: { idUsuario: number; persona?: { pNombre: string; pApellido: string } };
  edicionVolumen?: { idEdicionVolumen: number; codigoBarras?: string; libro?: { idLibro: number; titulo: string } };
}

export interface HistorialPrestamo {
  idHistorial: number;
  idUsuario: number;
  idEdicionVolumen: number;
  fechaPrestamo: string;
  fechaDevolucion?: string;
  edicionVolumen?: { idEdicionVolumen: number; codigoBarras?: string; libro?: { idLibro: number; titulo: string } };
}

export interface VwPrestamoActivo {
  idPrestamo: number;
  idUsuario: number;
  usuario: string;
  titulo: string;
  codigoBarras: string;
  fechaPrestamo: string;
  fechaLimiteDevolucion: string;
  vencido: boolean;
}

export interface CreatePrestamoRequest {
  fechaLimiteDevolucion: string;
  idUsuario: number;
  idsEdicionVolumen: number[];
}

export interface CreateDevolucionRequest {
  idEdicionVolumen: number;
  fechaDevolucion?: string;
  estadoEntrega?: string;
}

export interface CreateReservaRequest {
  idUsuario: number;
  idEdicionVolumen: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; pageSize: number };
}
