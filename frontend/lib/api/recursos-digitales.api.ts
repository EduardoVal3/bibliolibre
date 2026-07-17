import { apiClient } from './client';
import type {
  RecursoDigital, DescargaAcceso, DispositivoPrestado,
  PrestamoDispositivo, VwRecursosMasDescargados, PaginatedResponse,
} from '@/types/recursos-digitales.types';

export const recursosDigitalesApi = {
  recursos: {
    getAll(params?: { page?: number; pageSize?: number }) {
      return apiClient.get<PaginatedResponse<RecursoDigital>>('/recursos-digitales', { params });
    },
    getById(id: number) {
      return apiClient.get<RecursoDigital>(`/recursos-digitales/${id}`);
    },
    getMasDescargados() {
      return apiClient.get<VwRecursosMasDescargados[]>('/recursos-digitales/mas-descargados');
    },
    create(data: Partial<RecursoDigital>) {
      return apiClient.post<RecursoDigital>('/recursos-digitales', data);
    },
    update(id: number, data: Partial<RecursoDigital>) {
      return apiClient.put<RecursoDigital>(`/recursos-digitales/${id}`, data);
    },
    delete(id: number) {
      return apiClient.delete<{ message: string }>(`/recursos-digitales/${id}`);
    },
    registrarAcceso(id: number, data: { tipoAccion: string }) {
      return apiClient.post<DescargaAcceso>(`/recursos-digitales/${id}/acceso`, data);
    },
  },
  dispositivos: {
    getAll() {
      return apiClient.get<DispositivoPrestado[]>('/dispositivos');
    },
    getById(id: number) {
      return apiClient.get<DispositivoPrestado>(`/dispositivos/${id}`);
    },
    create(data: Partial<DispositivoPrestado>) {
      return apiClient.post<DispositivoPrestado>('/dispositivos', data);
    },
    update(id: number, data: Partial<DispositivoPrestado>) {
      return apiClient.patch<DispositivoPrestado>(`/dispositivos/${id}`, data);
    },
    prestar(id: number, data: { idUsuario: number; fechaLimiteDevolucion?: string }) {
      return apiClient.post<PrestamoDispositivo>(`/dispositivos/${id}/prestar`, data);
    },
    devolver(id: number) {
      return apiClient.post<PrestamoDispositivo>(`/dispositivos/${id}/devolver`);
    },
    prestamos(id: number) {
      return apiClient.get<PrestamoDispositivo[]>(`/dispositivos/${id}/prestamos`);
    },
  },
};
