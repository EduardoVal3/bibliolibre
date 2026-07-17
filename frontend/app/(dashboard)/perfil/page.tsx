'use client';

import { useQuery } from '@tanstack/react-query';
import { usuariosApi } from '@/lib/api/usuarios.api';
import { getStoredUser } from '@/lib/auth/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, Phone, MapPin, Calendar, User, Tag } from 'lucide-react';

export default function PerfilPage() {
  const storedUser = getStoredUser();
  const { data: usuario, isLoading } = useQuery({
    queryKey: ['usuarios', 'me'],
    queryFn: () => usuariosApi.usuarios.getMe(),
  });

  if (isLoading) {
    return (
      <div className="flex-1 w-full max-w-3xl mx-auto p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!usuario) return null;
  const p = usuario.persona;

  return (
    <div className="flex-1 w-full max-w-3xl mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Mi Perfil</h1>
        <p className="text-zinc-500 text-sm">Información personal y de cuenta</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="w-5 h-5 text-indigo-600" />
            Datos personales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
              <User className="w-5 h-5 text-zinc-400 shrink-0" />
              <div>
                <p className="text-xs text-zinc-500">Nombre</p>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  {p?.pNombre} {p?.sNombre || ''} {p?.pApellido} {p?.sApellido || ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
              <Mail className="w-5 h-5 text-zinc-400 shrink-0" />
              <div>
                <p className="text-xs text-zinc-500">Correo</p>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">{p?.correo}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
              <Phone className="w-5 h-5 text-zinc-400 shrink-0" />
              <div>
                <p className="text-xs text-zinc-500">Teléfono</p>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">{p?.telefono || 'No registrado'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
              <MapPin className="w-5 h-5 text-zinc-400 shrink-0" />
              <div>
                <p className="text-xs text-zinc-500">Dirección</p>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">{p?.direccion || 'No registrada'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
              <Tag className="w-5 h-5 text-zinc-400 shrink-0" />
              <div>
                <p className="text-xs text-zinc-500">Tipo de usuario</p>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">{usuario.tipoUsuario?.nombreTipo || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg">
              <Calendar className="w-5 h-5 text-zinc-400 shrink-0" />
              <div>
                <p className="text-xs text-zinc-500">Registrado desde</p>
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  {new Date(usuario.fechaRegistro).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
