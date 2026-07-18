'use client';

import { Button } from '@/components/ui/button';
import { useCreateReserva } from '@/hooks/use-prestamos';
import { getStoredUser } from '@/lib/auth/auth';
import { Bookmark } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface ReservaButtonProps {
  idEdicionVolumen: number;
  disabled?: boolean;
}

export function ReservaButton({ idEdicionVolumen, disabled }: ReservaButtonProps) {
  const router = useRouter();
  const pathname = usePathname();
  const user = getStoredUser();
  const createReserva = useCreateReserva();

  const handleClick = () => {
    if (!user) {
      router.push(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    createReserva.mutate({ idUsuario: user.sub, idEdicionVolumen });
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-1.5 cursor-pointer"
      disabled={disabled || createReserva.isPending}
      onClick={handleClick}
    >
      <Bookmark className="w-3.5 h-3.5" />
      {createReserva.isPending ? 'Reservando...' : 'Reservar'}
    </Button>
  );
}
