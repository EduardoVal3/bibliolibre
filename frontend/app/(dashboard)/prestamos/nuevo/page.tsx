'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { catalogoApi } from '@/lib/api/catalogo.api';
import { useCreatePrestamo } from '@/hooks/use-prestamos';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { NativeSelect } from '@/components/ui/native-select';
import { Loader2, ArrowLeft, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function NuevoPrestamoPage() {
  const router = useRouter();
  const createPrestamo = useCreatePrestamo();

  const [idUsuario, setIdUsuario] = useState('');
  const [fechaLimite, setFechaLimite] = useState('');
  const [selectedCopies, setSelectedCopies] = useState<number[]>([]);
  const [currentCopy, setCurrentCopy] = useState('');

  const { data: librosData } = useQuery({
    queryKey: ['libros-lista'],
    queryFn: () => catalogoApi.getLibros({ pageSize: 100 }),
  });

  const availableCopies = librosData?.data?.flatMap((libro) =>
    (libro.ejemplares || [])
      .filter((e) => e.disponibilidad === 'Disponible')
      .map((e) => ({
        id: e.idEdicionVolumen,
        label: `${e.codigoBarras || `ID: ${e.idEdicionVolumen}`} — ${libro.titulo}`,
      })),
  ) || [];

  const addCopy = () => {
    const id = Number(currentCopy);
    if (!id) { toast.warning('Selecciona un ejemplar'); return; }
    if (selectedCopies.includes(id)) { toast.warning('Ejemplar ya agregado'); return; }
    setSelectedCopies([...selectedCopies, id]);
    setCurrentCopy('');
  };

  const removeCopy = (id: number) => {
    setSelectedCopies(selectedCopies.filter((c) => c !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idUsuario || !fechaLimite || selectedCopies.length === 0) {
      toast.warning('Completa todos los campos');
      return;
    }
    createPrestamo.mutate(
      {
        idUsuario: Number(idUsuario),
        fechaLimiteDevolucion: fechaLimite,
        idsEdicionVolumen: selectedCopies,
      },
      { onSuccess: () => router.push('/prestamos') },
    );
  };

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto p-4 md:p-6 space-y-6">
      <Link href="/prestamos" className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors text-sm font-medium">
        <ArrowLeft className="w-4 h-4" />
        Volver a préstamos
      </Link>

      <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm">
        <CardHeader className="p-6 border-b border-zinc-100 dark:border-zinc-800">
          <CardTitle className="text-xl font-bold">Nuevo Préstamo</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">ID del Usuario *</label>
              <Input
                type="number"
                placeholder="Ej. 1"
                value={idUsuario}
                onChange={(e) => setIdUsuario(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Fecha límite de devolución *</label>
              <Input
                type="date"
                value={fechaLimite}
                onChange={(e) => setFechaLimite(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Ejemplares a prestar</label>
              <div className="flex gap-2">
                <NativeSelect value={currentCopy} onChange={(e) => setCurrentCopy(e.target.value)} className="flex-1">
                  <option value="">Seleccionar ejemplar disponible...</option>
                  {availableCopies.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </NativeSelect>
                <Button type="button" variant="outline" size="icon" onClick={addCopy} className="cursor-pointer shrink-0">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              {selectedCopies.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedCopies.map((id) => {
                    const c = availableCopies.find((a) => a.id === id);
                    return (
                      <span key={id} className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400 rounded-md">
                        {c?.label || `ID: ${id}`}
                        <button type="button" onClick={() => removeCopy(id)} className="hover:text-red-500 cursor-pointer">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium border-0 cursor-pointer"
              disabled={createPrestamo.isPending}
            >
              {createPrestamo.isPending ? (
                <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Creando...</span>
              ) : (
                'Registrar Préstamo'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
