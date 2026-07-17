export interface Proveedor {
  idProveedor: number;
  nombreEmpresa: string;
  contacto?: string;
  telefono?: string;
  correo?: string;
}

export interface Presupuesto {
  idPresupuesto: number;
  anio: number;
  montoAsignado: number;
}

export interface VwPresupuestoEjecutado {
  idPresupuesto: number;
  anio: number;
  montoAsignado: number;
  montoEjecutado: number;
  montoDisponible: number;
}

export interface DetalleOrdenItem {
  cantidad: number;
  precioUnitario: number;
}

export interface DetalleOrden extends DetalleOrdenItem {
  idDetalleOrden: number;
  idOrdenCompra: number;
}

export interface OrdenCompra {
  idOrdenCompra: number;
  fechaOrden: string;
  totalOrden: number;
  idProveedor: number;
  idPresupuesto?: number;
  proveedor?: Proveedor;
  presupuesto?: Presupuesto;
  detalles?: DetalleOrden[];
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: { total: number; page: number; pageSize: number };
}
