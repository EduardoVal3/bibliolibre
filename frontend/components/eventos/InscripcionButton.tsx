'use client';

import { Button } from '@/components/ui/button';
import { useInscribir } from '@/hooks/use-eventos';
import { Loader2, UserPlus } from 'lucide-react';

interface InscripcionButtonProps {
  idEvento: number;
  lleno: boolean;
  inscrito: boolean;
}

export function InscripcionButton({ idEvento, lleno, inscrito }: InscripcionButtonProps) {
  const { mutate, isPending } = useInscribir();

  if (inscrito) {
    return (
      <Button disabled variant="outline" className="cursor-default gap-2">
        Inscrito
      </Button>
    );
  }

  if (lleno) {
    return (
      <Button disabled variant="outline" className="cursor-not-allowed gap-2">
        Cupo lleno
      </Button>
    );
  }

  return (
    <Button
      onClick={() => mutate(idEvento)}
      disabled={isPending}
      className="bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer gap-2"
    >
      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
      Inscribirme
    </Button>
  );
}
