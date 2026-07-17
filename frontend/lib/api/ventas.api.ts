import { apiClient } from './client';
import type {
  ProductoVenta, Venta, MetodoPago, RolEmpleado, Empleado, Turno, Permiso,
  CreateVentaRequest, VwVentasPorEmpleado, PaginatedResponse,
} from '@/types/ventas.types';

export const ventasApi = {
  ventas: {
    create(data: CreateVentaRequest) {
      return apiClient.post<Venta>('/ventas', data);
    },
    getAll(params?: { page?: number; pageSize?: number; empleado?: number; fechaDesde?: string; fechaHasta?: string }) {
      return apiClient.get<PaginatedResponse<Venta>>('/ventas', { params });
    },
    getById(id: number) {
      return apiClient.get<Venta>(`/ventas/${id}`);
    },
  },
  productosVenta: {
    getAll() {
      return apiClient.get<ProductoVenta[]>('/productos-venta');
    },
    getById(id: number) {
      return apiClient.get<ProductoVenta>(`/productos-venta/${id}`);
    },
    create(data: Partial<ProductoVenta>) {
      return apiClient.post<ProductoVenta>('/productos-venta', data);
    },
    update(id: number, data: Partial<ProductoVenta>) {
      return apiClient.put<ProductoVenta>(`/productos-venta/${id}`, data);
    },
    delete(id: number) {
      return apiClient.delete<{ message: string }>(`/productos-venta/${id}`);
    },
  },
  empleados: {
    getAll() {
      return apiClient.get<Empleado[]>('/empleados');
    },
    getById(id: number) {
      return apiClient.get<Empleado>(`/empleados/${id}`);
    },
    create(data: Partial<Empleado>) {
      return apiClient.post<Empleado>('/empleados', data);
    },
    update(id: number, data: Partial<Empleado>) {
      return apiClient.put<Empleado>(`/empleados/${id}`, data);
    },
    delete(id: number) {
      return apiClient.delete<{ message: string }>(`/empleados/${id}`);
    },
  },
  rolesEmpleado: {
    getAll() {
      return apiClient.get<RolEmpleado[]>('/roles-empleado');
    },
    getById(id: number) {
      return apiClient.get<RolEmpleado>(`/roles-empleado/${id}`);
    },
    create(data: Partial<RolEmpleado>) {
      return apiClient.post<RolEmpleado>('/roles-empleado', data);
    },
    update(id: number, data: Partial<RolEmpleado>) {
      return apiClient.put<RolEmpleado>(`/roles-empleado/${id}`, data);
    },
    delete(id: number) {
      return apiClient.delete<{ message: string }>(`/roles-empleado/${id}`);
    },
    assignPermiso(idRol: number, idPermiso: number) {
      return apiClient.post<{ message: string }>(`/roles-empleado/${idRol}/permisos`, { idPermiso });
    },
  },
  permisos: {
    getAll() {
      return apiClient.get<Permiso[]>('/permisos');
    },
    getById(id: number) {
      return apiClient.get<Permiso>(`/permisos/${id}`);
    },
    create(data: Partial<Permiso>) {
      return apiClient.post<Permiso>('/permisos', data);
    },
    update(id: number, data: Partial<Permiso>) {
      return apiClient.put<Permiso>(`/permisos/${id}`, data);
    },
    delete(id: number) {
      return apiClient.delete<{ message: string }>(`/permisos/${id}`);
    },
  },
  turnos: {
    getAll() {
      return apiClient.get<Turno[]>('/turnos');
    },
  },
  metodosPago: {
    getAll() {
      return apiClient.get<MetodoPago[]>('/metodos-pago');
    },
  },
  reportes: {
    ventasPorEmpleado() {
      return apiClient.get<VwVentasPorEmpleado[]>('/reportes/ventas-por-empleado');
    },
  },
};
