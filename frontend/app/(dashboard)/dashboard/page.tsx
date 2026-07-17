'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { getStoredUser } from '@/lib/auth/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Hand, Store, DollarSign, PartyPopper, Monitor, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const user = getStoredUser();

  const { data: prestamos } = useQuery({
    queryKey: ['dashboard', 'prestamos'],
    queryFn: () => apiClient.get<{ data: any[]; meta: any }>('/prestamos', { params: { pageSize: 1 } }),
  });

  const { data: vencidos } = useQuery({
    queryKey: ['dashboard', 'vencidos'],
    queryFn: () => apiClient.get<{ data: any[]; meta: any }>('/prestamos/vencidos', { params: { pageSize: 1 } }),
  });

  const { data: ventas } = useQuery({
    queryKey: ['dashboard', 'ventas-mes'],
    queryFn: () => {
      const now = new Date();
      const desde = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
      const hasta = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
      return apiClient.get<{ data: any[]; meta: any }>('/ventas', { params: { fechaDesde: desde, fechaHasta: hasta, pageSize: 100 } });
    },
  });

  const { data: eventos } = useQuery({
    queryKey: ['dashboard', 'eventos'],
    queryFn: () => apiClient.get<{ data: any[]; meta: any }>('/eventos', { params: { pageSize: 5 } }),
  });

  const { data: masDescargados } = useQuery({
    queryKey: ['dashboard', 'mas-descargados'],
    queryFn: () => apiClient.get<any[]>('/recursos-digitales/mas-descargados'),
  });

  const { data: presupuestos } = useQuery({
    queryKey: ['dashboard', 'presupuestos'],
    queryFn: () => apiClient.get<{ data: any[]; meta: any }>('/presupuestos', { params: { pageSize: 5 } }),
  });

  const totalPrestamos = prestamos?.meta?.total ?? 0;
  const totalVencidos = vencidos?.meta?.total ?? 0;
  const ventasMes = ventas?.data ?? [];
  const totalVentasMes = ventasMes.reduce((s: number, v: any) => s + Number(v.total || 0), 0);
  const proximosEventos = (eventos?.data ?? []).filter((e: any) => new Date(e.fechaEvento) >= new Date(new Date().toDateString())).slice(0, 5);

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          {user ? `Bienvenido, ${user.correo}` : 'Dashboard'}
        </h1>
        <p className="text-zinc-500 text-sm">Resumen general del sistema</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/prestamos">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-zinc-500">Préstamos activos</CardTitle>
              <Hand className="w-5 h-5 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{totalPrestamos}</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/prestamos?vencido=true">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-zinc-500">Vencidos</CardTitle>
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{totalVencidos}</div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/ventas">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-zinc-500">Ventas del mes</CardTitle>
              <Store className="w-5 h-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">${Number(totalVentasMes).toFixed(2)}</div>
              <p className="text-xs text-zinc-400">{ventasMes.length} transacciones</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/eventos">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-zinc-500">Próximos eventos</CardTitle>
              <PartyPopper className="w-5 h-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">{proximosEventos.length}</div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <PartyPopper className="w-4 h-4 text-amber-500" />
              Próximos eventos
            </CardTitle>
          </CardHeader>
          <CardContent>
            {proximosEventos.length === 0 ? (
              <p className="text-sm text-zinc-400">No hay eventos próximos</p>
            ) : (
              <div className="space-y-3">
                {proximosEventos.map((e: any) => (
                  <Link key={e.idEvento} href={`/eventos/${e.idEvento}`} className="block p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                    <div className="font-medium text-sm">{e.nombreEvento}</div>
                    <div className="text-xs text-zinc-500 mt-1">{new Date(e.fechaEvento).toLocaleDateString('es-ES')}</div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Monitor className="w-4 h-4 text-indigo-500" />
              Recursos más descargados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!masDescargados ? (
              <div className="flex justify-center py-4"><Loader2 className="w-5 h-5 animate-spin text-zinc-400" /></div>
            ) : masDescargados.length === 0 ? (
              <p className="text-sm text-zinc-400">Sin datos</p>
            ) : (
              <div className="space-y-3">
                {masDescargados.slice(0, 5).map((r: any) => (
                  <div key={r.idrecurso} className="flex items-center justify-between p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <div>
                      <div className="font-medium text-sm">{r.titulo}</div>
                      <div className="text-xs text-zinc-500">{r.tiporecurso}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold">{r.total_descargas}</div>
                      <div className="text-xs text-zinc-400">descargas</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {presupuestos?.data && presupuestos.data.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                Presupuestos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {presupuestos.data.slice(0, 3).map((p: any) => (
                  <Link key={p.idPresupuesto} href="/presupuestos" className="block p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">Presupuesto {p.anio}</span>
                      <span className="text-sm font-semibold">${Number(p.montoAsignado || 0).toLocaleString()}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              Acceso rápido
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {[
                { href: '/prestamos/nuevo', label: 'Nuevo préstamo', icon: Hand },
                { href: '/ventas/nueva', label: 'Nueva venta', icon: Store },
                { href: '/eventos/nuevo', label: 'Nuevo evento', icon: PartyPopper },
                { href: '/catalogo/nuevo', label: 'Nuevo libro', icon: BookOpen },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <Card className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors cursor-pointer">
                      <CardContent className="p-4 flex flex-col items-center gap-2 text-center">
                        <Icon className="w-5 h-5 text-indigo-500" />
                        <span className="text-xs font-medium">{item.label}</span>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
