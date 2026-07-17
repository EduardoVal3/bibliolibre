'use client';

import Link from 'next/link';
import { useDispositivos } from '@/hooks/use-recursos-digitales';
import { DispositivoTable } from '@/components/recursos-digitales/DispositivoTable';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Plus } from 'lucide-react';

export default function DispositivosPage() {
  const { data: dispositivos, isLoading, refetch, isFetching } = useDispositivos();

  return (
    <div className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Dispositivos</h1>
          <p className="text-zinc-500 text-sm">Gestión de dispositivos prestables</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={isFetching} className="cursor-pointer gap-2">
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} /> Actualizar
          </Button>
          <Link href="/dispositivos/nuevo">
            <Button size="sm" className="cursor-pointer gap-2"><Plus className="w-4 h-4" /> Nuevo</Button>
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
      ) : (
        <DispositivoTable dispositivos={dispositivos || []} />
      )}
    </div>
  );
}
