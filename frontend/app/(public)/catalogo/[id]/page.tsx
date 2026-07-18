'use client';

import { useQuery } from '@tanstack/react-query';
import { catalogoApi } from '@/lib/api/catalogo.api';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DisponibilidadBadge } from '@/components/catalogo/DisponibilidadBadge';
import { ReservaButton } from '@/components/catalogo/ReservaButton';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LibroPublicDetailPage() {
  const params = useParams();
  const id = Number(params.id);

  const { data: libro, isLoading, error } = useQuery({
    queryKey: ['libro', id],
    queryFn: () => catalogoApi.getLibroById(id),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24 flex-1">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !libro) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center space-y-4">
        <h2 className="text-xl font-semibold text-destructive">Error al cargar libro</h2>
        <p className="text-muted-foreground">El libro solicitado no existe o no se pudo cargar.</p>
        <Link href="/catalogo">
          <Button variant="outline">Regresar al catálogo</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      <Link href="/catalogo" className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">
        <ArrowLeft className="w-4 h-4" />
        Regresar al catálogo
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-card border-border shadow-sm overflow-hidden">
          <CardHeader className="p-6 border-b border-border">
            <div>
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">{libro.categoria?.nombreCategoria}</span>
              <CardTitle className="text-2xl font-bold mt-1 text-foreground">{libro.titulo}</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-muted-foreground block text-xs">ISBN</label>
                <span className="font-semibold text-foreground">{libro.isbn || '-'}</span>
              </div>
              <div>
                <label className="text-muted-foreground block text-xs">Año de Publicación</label>
                <span className="font-semibold text-foreground">{libro.anioPublicacion}</span>
              </div>
              <div>
                <label className="text-muted-foreground block text-xs">Edición</label>
                <span className="font-semibold text-foreground">{libro.edicion}</span>
              </div>
              <div>
                <label className="text-muted-foreground block text-xs">Idioma</label>
                <span className="font-semibold text-foreground">{libro.idioma?.nombreIdioma}</span>
              </div>
              <div className="col-span-2">
                <label className="text-muted-foreground block text-xs">Editorial</label>
                <span className="font-semibold text-foreground">{libro.editorial?.nombre}</span>
              </div>
              <div className="col-span-2">
                <label className="text-muted-foreground block text-xs">Autores</label>
                <span className="font-semibold text-foreground">
                  {libro.autores?.map((a) => a.nombre).join(', ') || '-'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="p-6">
            <CardTitle className="text-lg font-bold">Disponibilidad</CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Ejemplares totales</span>
              <span className="font-bold text-lg text-foreground">{libro.ejemplares?.length || 0}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-muted-foreground">Disponibles para préstamo</span>
              <span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
                {libro.ejemplares?.filter((e) => e.disponibilidad === 'Disponible').length || 0}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-muted-foreground">Prestados</span>
              <span className="font-bold text-lg text-amber-600 dark:text-amber-400">
                {libro.ejemplares?.filter((e) => e.disponibilidad === 'Prestado').length || 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground mb-4">Ejemplares</h2>
        <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted text-muted-foreground font-semibold">
                <th className="p-4">Código de Barras</th>
                <th className="p-4">Estado Físico</th>
                <th className="p-4">Disponibilidad</th>
                <th className="p-4 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {!libro.ejemplares || libro.ejemplares.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-muted-foreground">
                    Este libro no cuenta con ningún ejemplar registrado.
                  </td>
                </tr>
              ) : (
                libro.ejemplares.map((ejemplar) => (
                  <tr key={ejemplar.idEdicionVolumen} className="hover:bg-muted/50">
                    <td className="p-4 font-mono font-medium">{ejemplar.codigoBarras || `ID: ${ejemplar.idEdicionVolumen}`}</td>
                    <td className="p-4">{ejemplar.estadoFisico || 'Bueno'}</td>
                    <td className="p-4">
                      <DisponibilidadBadge disponibilidad={ejemplar.disponibilidad} />
                    </td>
                    <td className="p-4 text-right">
                      <ReservaButton idEdicionVolumen={ejemplar.idEdicionVolumen} disabled={ejemplar.disponibilidad !== 'Disponible'} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
