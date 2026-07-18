'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usuariosApi } from '@/lib/api/usuarios.api';
import { getStoredUser } from '@/lib/auth/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, Check, Crown } from 'lucide-react';
import { toast } from 'sonner';
import type { Membresia, CrearOrdenResponse } from '@/types/usuarios.types';

function PayPalButton({ orderId, onCaptured }: { orderId: string; onCaptured: () => void }) {
  const capture = useMutation({
    mutationFn: () => usuariosApi.pagos.capturarOrden(orderId),
    onSuccess: (data) => {
      if (data.status === 'COMPLETED') {
        toast.success('Membresía actualizada');
        onCaptured();
      }
    },
    onError: (e: any) => toast.error(e.message || 'Error al confirmar pago'),
  });

  return (
    <Button onClick={() => capture.mutate()} disabled={capture.isPending} className="w-full cursor-pointer">
      {capture.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
      Confirmar pago
    </Button>
  );
}

export default function MembresiasClientePage() {
  const qc = useQueryClient();
  const user = getStoredUser();
  const [orderMap, setOrderMap] = useState<Record<number, CrearOrdenResponse | null>>({});

  const { data: historial, isLoading: loadingHistorial } = useQuery({
    queryKey: ['usuarios', user?.sub, 'membresias'],
    queryFn: () => usuariosApi.usuarios.getMembresias(user!.sub),
    enabled: !!user?.sub,
  });

  const { data: disponibles, isLoading: loadingDisponibles } = useQuery({
    queryKey: ['membresias-disponibles'],
    queryFn: () => usuariosApi.pagos.getDisponibles(),
  });

  const crearOrden = useMutation({
    mutationFn: (idMembresia: number) => usuariosApi.pagos.crearOrden(idMembresia),
    onSuccess: (data, idMembresia) => {
      setOrderMap((prev) => ({ ...prev, [idMembresia]: data }));
    },
    onError: (e: any) => toast.error(e.message || 'Error al crear orden'),
  });

  const current = historial?.find((h) => !h.fechaFin || new Date(h.fechaFin) >= new Date());
  const currentPlan = current?.membresia;
  const isAvailable = Array.isArray(disponibles) ? disponibles : [];

  const onCaptured = () => {
    setOrderMap({});
    qc.invalidateQueries({ queryKey: ['usuarios', user?.sub, 'membresias'] });
    qc.invalidateQueries({ queryKey: ['membresias-disponibles'] });
  };

  if (loadingHistorial || loadingDisponibles) {
    return (
      <div className="flex-1 w-full max-w-4xl mx-auto p-6 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Membresía</h1>
        <p className="text-zinc-500 text-sm">Gestiona tu plan de membresía</p>
      </div>

      {currentPlan ? (
        <Card className="border-indigo-200 dark:border-indigo-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Crown className="w-5 h-5 text-indigo-600" />
              Plan actual
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-900 dark:text-zinc-50">{currentPlan.nombreMembresia}</span>
              <Badge variant="default" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                Activo
              </Badge>
            </div>
            {current?.fechaInicio && (
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Desde</span>
                <span className="font-medium">{new Date(current.fechaInicio).toLocaleDateString()}</span>
              </div>
            )}
            {current?.fechaFin ? (
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Vence</span>
                <span className="font-medium">{new Date(current.fechaFin).toLocaleDateString()}</span>
              </div>
            ) : (
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Vence</span>
                <span className="font-medium">Sin fecha límite</span>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-zinc-500">
            <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-50" />
            No tienes una membresía activa. Elige un plan para empezar.
          </CardContent>
        </Card>
      )}

      {isAvailable.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Planes disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isAvailable.map((m) => {
              const order = orderMap[m.idMembresia];
              const creating = crearOrden.isPending && crearOrden.variables === m.idMembresia;

              return (
                <Card key={m.idMembresia} className="border-zinc-200 dark:border-zinc-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Crown className="w-5 h-5 text-amber-500" />
                      {m.nombreMembresia}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-zinc-500">{m.descripcion || ''}</p>
                    <div className="flex justify-between items-center pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      <span className="text-sm text-zinc-500">Costo</span>
                      <span className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                        ${Number(m.costo).toFixed(2)} USD
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-zinc-500">Duración</span>
                      <span className="font-medium">{m.duracionMeses} meses</span>
                    </div>

                    {!order ? (
                      <Button
                        onClick={() => crearOrden.mutate(m.idMembresia)}
                        disabled={creating}
                        className="w-full cursor-pointer gap-2"
                      >
                        {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Crown className="w-4 h-4" />}
                        Mejorar a {m.nombreMembresia}
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                          <Check className="w-4 h-4" />
                          Orden creada
                        </div>
                        <PayPalButton orderId={order.id} onCaptured={onCaptured} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {isAvailable.length === 0 && currentPlan && (
        <Card>
          <CardContent className="py-8 text-center text-zinc-500">
            <Crown className="w-8 h-8 mx-auto mb-2 opacity-50" />
            Ya tienes el mejor plan disponible.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
