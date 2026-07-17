'use client';

import { useVencidos } from '@/hooks/use-prestamos';
import { AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export function VencidosAlertBadge() {
  const { data } = useVencidos({ pageSize: 1 });
  const count = data?.meta?.total || 0;

  if (count === 0) return null;

  return (
    <Link
      href="/prestamos?vencido=true"
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/30 hover:bg-amber-100 dark:hover:bg-amber-950/50 transition-colors"
    >
      <AlertTriangle className="w-4 h-4" />
      <span>{count} préstamo{count !== 1 ? 's' : ''} vencido{count !== 1 ? 's' : ''}</span>
    </Link>
  );
}
