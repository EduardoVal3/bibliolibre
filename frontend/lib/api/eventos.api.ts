import { apiClient } from './client';
import type {
  Evento, EventoConCupo, AsistenciaEvento,
  CreateEventoRequest, UpdateEventoRequest, MarcarAsistenciaRequest, PaginatedResponse,
} from '@/types/eventos.types';

export const eventosApi = {
  getAll(params?: { page?: number; pageSize?: number }) {
    return apiClient.get<PaginatedResponse<Evento>>('/eventos', { params });
  },

  getById(id: number) {
    return apiClient.get<Evento>(`/eventos/${id}`);
  },

  getCupo(id: number) {
    return apiClient.get<EventoConCupo>(`/eventos/${id}/cupo`);
  },

  getAsistencias(id: number) {
    return apiClient.get<AsistenciaEvento[]>(`/eventos/${id}/asistencias`);
  },

  create(data: CreateEventoRequest) {
    return apiClient.post<Evento>('/eventos', data);
  },

  update(id: number, data: UpdateEventoRequest) {
    return apiClient.put<Evento>(`/eventos/${id}`, data);
  },

  remove(id: number) {
    return apiClient.delete<{ message: string }>(`/eventos/${id}`);
  },

  inscribir(id: number) {
    return apiClient.post<AsistenciaEvento>(`/eventos/${id}/inscripcion`);
  },

  marcarAsistencia(idEvento: number, idUsuario: number, data: MarcarAsistenciaRequest) {
    return apiClient.patch<AsistenciaEvento>(`/eventos/${idEvento}/asistencia/${idUsuario}`, data);
  },
};
