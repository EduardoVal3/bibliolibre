'use client';

import { Button } from '@/components/ui/button';
import { Download, Eye, Loader2 } from 'lucide-react';
import { useRegistrarAcceso } from '@/hooks/use-recursos-digitales';

interface AccesoButtonProps {
  idRecurso: number;
  tipoAccion: 'Descarga' | 'Visualización';
  urlAcceso?: string;
}

export function AccesoButton({ idRecurso, tipoAccion, urlAcceso }: AccesoButtonProps) {
  const mutation = useRegistrarAcceso();
  const Icon = tipoAccion === 'Descarga' ? Download : Eye;

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={mutation.isPending}
      className="cursor-pointer gap-1.5"
      onClick={() => {
        mutation.mutate(
          { id: idRecurso, data: { tipoAccion } },
          {
            onSuccess: () => {
              if (urlAcceso) window.open(urlAcceso, '_blank');
            },
          },
        );
      }}
    >
      {mutation.isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Icon className="w-3.5 h-3.5" />
      )}
      {tipoAccion === 'Descarga' ? 'Descargar' : 'Ver'}
    </Button>
  );
}
