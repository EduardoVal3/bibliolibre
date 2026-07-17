import { apiClient } from './client';
import type {
  Prestamo,
  Devolucion,
  Reserva,
  HistorialPrestamo,
  VwPrestamoActivo,
  CreatePrestamoRequest,
  CreateDevolucionRequest,
  CreateReservaRequest,
  PaginatedResponse,
} from '@/types/prestamos.types';

export const prestamosApi = {
  createPrestamo(data: CreatePrestamoRequest) {
    return apiClient.post<Prestamo>('/prestamos', data);
  },

  getPrestamos(params?: { page?: number; pageSize?: number; usuario?: number; vencido?: string }) {
    return apiClient.get<PaginatedResponse<Prestamo>>('/prestamos', { params });
  },

  getPrestamoById(id: number) {
    return apiClient.get<Prestamo>(`/prestamos/${id}`);
  },

  getVencidos(params?: { page?: number; pageSize?: number }) {
    return apiClient.get<PaginatedResponse<VwPrestamoActivo>>('/prestamos/vencidos', { params });
  },

  createDevolucion(data: CreateDevolucionRequest) {
    return apiClient.post<Devolucion>('/devoluciones', data);
  },

  createReserva(data: CreateReservaRequest) {
    return apiClient.post<Reserva>('/reservas', data);
  },

  getReservas(params?: { page?: number; pageSize?: number; usuario?: number }) {
    return apiClient.get<PaginatedResponse<Reserva>>('/reservas', { params });
  },

  cancelReserva(id: number) {
    return apiClient.delete<Reserva>(`/reservas/${id}`);
  },

  getHistorial(idUsuario: number, params?: { page?: number; pageSize?: number }) {
    return apiClient.get<PaginatedResponse<HistorialPrestamo>>(`/usuarios/${idUsuario}/historial-prestamos`, { params });
  },
};
