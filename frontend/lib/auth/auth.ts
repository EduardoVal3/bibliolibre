import { usuariosApi } from '@/lib/api/usuarios.api';
import type { LoginResponse } from '@/types/usuarios.types';

const TOKEN_KEY = 'auth_token';
const REFRESH_KEY = 'auth_refresh';
const USER_KEY = 'auth_user';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setTokens(data: LoginResponse): void {
  localStorage.setItem(TOKEN_KEY, data.accessToken);
  localStorage.setItem(REFRESH_KEY, data.refreshToken);
  localStorage.setItem(USER_KEY, JSON.stringify(data.usuario));
  document.cookie = `auth_token=${data.accessToken}; path=/; max-age=604800; SameSite=Lax`;
}

export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
  localStorage.removeItem(USER_KEY);
  document.cookie = 'auth_token=; path=/; max-age=0';
}

export function getStoredUser(): LoginResponse['usuario'] | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = localStorage.getItem(REFRESH_KEY);
  if (!refreshToken) return null;
  try {
    const res = await usuariosApi.auth.refresh(refreshToken);
    localStorage.setItem(TOKEN_KEY, res.accessToken);
    document.cookie = `auth_token=${res.accessToken}; path=/; max-age=604800; SameSite=Lax`;
    return res.accessToken;
  } catch {
    clearTokens();
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
