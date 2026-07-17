export interface ProductoVenta {
  idProducto: number;
  nombre: string;
  descripcion?: string;
  precio: string;
  stockDisponible: number;
}

export interface Venta {
  idVenta: number;
  fechaVenta: string;
  idUsuario: number;
  idEmpleado: number;
  total: string;
  empleado?: { idEmpleado: number; persona: { pNombre: string; pApellido: string } };
  detalles?: DetalleVenta[];
  pagos?: PagoVenta[];
}

export interface DetalleVenta {
  idDetalleVenta: number;
  idVenta: number;
  idProducto: number;
  cantidad: number;
  precioUnitario: string;
  subtotal: string;
  producto?: ProductoVenta;
}

export interface PagoVenta {
  idPagoVenta: number;
  idVenta: number;
  idMetodoPago: number;
  monto: string;
  metodoPago?: MetodoPago;
}

export interface MetodoPago {
  idMetodoPago: number;
  nombreMetodo: string;
}

export interface RolEmpleado {
  idRol: number;
  nombreRol: string;
  descripcion?: string;
}

export interface Empleado {
  idEmpleado: number;
  fechaContratacion?: string;
  idPersona: number;
  idRol: number;
  idTurno?: number;
  persona?: { idPersona: number; pNombre: string; pApellido: string; correo: string };
  rol?: RolEmpleado;
  turno?: Turno;
}

export interface Turno {
  idTurno: number;
  nombreTurno: string;
  horaInicio: string;
  horaFin: string;
}

export interface Permiso {
  idPermiso: number;
  nombrePermiso: string;
  descripcion?: string;
}

export interface RolPermiso {
  idRolPermiso: number;
  idRol: number;
  idPermiso: number;
}

export interface CreateVentaRequest {
  idUsuario: number;
  idEmpleado: number;
  productos: number[];
  cantidades: number[];
  idMetodoPago: number;
}

export interface VwVentasPorEmpleado {
  idEmpleado: number;
  empleado: string;
  totalVentas: number;
  montoTotal: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; pageSize: number };
}

export interface ApiError {
  message: string;
  statusCode: number;
  error: string;
  timestamp: string;
  path: string;
}
