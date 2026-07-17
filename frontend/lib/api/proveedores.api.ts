import { apiClient } from './client';
import type {
  Proveedor, Presupuesto, VwPresupuestoEjecutado,
  OrdenCompra, PaginatedResponse,
} from '@/types/proveedores.types';

export const proveedoresApi = {
  proveedores: {
    getAll(params?: { page?: number; pageSize?: number }) {
      return apiClient.get<PaginatedResponse<Proveedor>>('/proveedores', { params });
    },
    getById(id: number) {
      return apiClient.get<Proveedor>(`/proveedores/${id}`);
    },
    create(data: Partial<Proveedor>) {
      return apiClient.post<Proveedor>('/proveedores', data);
    },
    update(id: number, data: Partial<Proveedor>) {
      return apiClient.put<Proveedor>(`/proveedores/${id}`, data);
    },
    delete(id: number) {
      return apiClient.delete<{ message: string }>(`/proveedores/${id}`);
    },
  },
  presupuestos: {
    getAll(params?: { page?: number; pageSize?: number }) {
      return apiClient.get<PaginatedResponse<Presupuesto>>('/presupuestos', { params });
    },
    getById(id: number) {
      return apiClient.get<Presupuesto>(`/presupuestos/${id}`);
    },
    getEjecucion(id: number) {
      return apiClient.get<VwPresupuestoEjecutado>(`/presupuestos/${id}/ejecucion`);
    },
    create(data: Partial<Presupuesto>) {
      return apiClient.post<Presupuesto>('/presupuestos', data);
    },
    update(id: number, data: Partial<Presupuesto>) {
      return apiClient.put<Presupuesto>(`/presupuestos/${id}`, data);
    },
    delete(id: number) {
      return apiClient.delete<{ message: string }>(`/presupuestos/${id}`);
    },
  },
  ordenesCompra: {
    getAll(params?: { page?: number; pageSize?: number }) {
      return apiClient.get<PaginatedResponse<OrdenCompra>>('/ordenes-compra', { params });
    },
    getById(id: number) {
      return apiClient.get<OrdenCompra>(`/ordenes-compra/${id}`);
    },
    create(data: { idProveedor: number; idPresupuesto?: number; detalles: { cantidad: number; precioUnitario: number }[] }) {
      return apiClient.post<OrdenCompra>('/ordenes-compra', data);
    },
  },
};
