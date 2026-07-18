'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { recursosDigitalesApi } from '@/lib/api/recursos-digitales.api';
import { useRegistrarAcceso } from '@/hooks/use-recursos-digitales';
import { getStoredUser } from '@/lib/auth/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Download, Eye, Monitor } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function BibliotecaDigitalPage() {
  const router = useRouter();
  const user = getStoredUser();
  const [page, setPage] = useState(1);
  const registrarAcceso = useRegistrarAcceso();

  const { data, isLoading } = useQuery({
    queryKey: ['recursos-digitales', 'public', { page }],
    queryFn: () => recursosDigitalesApi.recursos.getAll({ page, pageSize: 12 }),
  });

  const handleAcceso = (id: number, tipoAccion: string) => {
    if (!user) {
      router.push(`/login?next=${encodeURIComponent('/catalogo/digitales')}`);
      return;
    }
    registrarAcceso.mutate(
      { id, data: { tipoAccion } },
      {
        onError: (e: any) => {
          const msg = e?.message || '';
          if (msg.toLowerCase().includes('membres') || msg.toLowerCase().includes('membresía')) {
            toast.error('Se requiere una membresía activa para acceder a este recurso.');
          } else {
            toast.error(msg || 'Error al registrar acceso');
          }
        },
      },
    );
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Biblioteca Digital</h1>
        <p className="text-muted-foreground text-sm">Accede a recursos digitales, descargas y contenido multimedia</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : !data?.data?.length ? (
        <div className="text-center py-16 bg-card border border-border rounded-2xl p-6 text-muted-foreground">
          No hay recursos digitales disponibles.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data.data.map((recurso) => (
            <Card key={recurso.idRecurso} className="flex flex-col bg-card border-border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="p-5 pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <Monitor className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-xs font-medium text-muted-foreground uppercase">
                    {recurso.tipoRecurso || 'Digital'}
                  </span>
                </div>
                <CardTitle className="text-base font-bold text-foreground line-clamp-2">
                  {recurso.titulo}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 pt-0 flex-1 flex flex-col justify-between gap-4">
                {recurso.formato && (
                  <span className="text-xs text-muted-foreground">
                    Formato: {recurso.formato}
                  </span>
                )}
                <div className="flex gap-2 mt-auto">
                  <Button
                    size="sm"
                    variant="default"
                    className="flex-1 cursor-pointer"
                    onClick={() => handleAcceso(recurso.idRecurso, 'Descarga')}
                    disabled={registrarAcceso.isPending}
                  >
                    <Download className="w-4 h-4 mr-1.5" />
                    Descargar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 cursor-pointer"
                    onClick={() => handleAcceso(recurso.idRecurso, 'Visualización')}
                    disabled={registrarAcceso.isPending}
                  >
                    <Eye className="w-4 h-4 mr-1.5" />
                    Ver
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {data?.meta && data.meta.total > 12 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <Button
            size="sm"
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="cursor-pointer"
          >
            Anterior
          </Button>
          <span className="text-xs text-muted-foreground font-medium">
            Página {page} de {Math.ceil(data.meta.total / 12)}
          </span>
          <Button
            size="sm"
            variant="outline"
            disabled={page >= Math.ceil(data.meta.total / 12)}
            onClick={() => setPage((p) => p + 1)}
            className="cursor-pointer"
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
}
