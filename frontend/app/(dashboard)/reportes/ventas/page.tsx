'use client';

import { useReporteVentasPorEmpleado } from '@/hooks/use-ventas';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from '@/components/ui/table';
import { Loader2, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ReporteVentasPage() {
  const { data, isLoading } = useReporteVentasPorEmpleado();

  const chartData = (data || []).map((v) => ({
    nombre: v.empleado,
    ventas: Number(v.totalVentas),
    monto: Number(v.montoTotal),
  }));

  return (
    <div className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="w-6 h-6 text-indigo-600" />
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Reporte de Ventas por Empleado</h1>
          <p className="text-zinc-500 text-sm">Resumen de ventas agrupadas por empleado</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <CardHeader><CardTitle className="text-lg">Gráfico de Ventas</CardTitle></CardHeader>
            <CardContent>
              {chartData.length === 0 ? (
                <p className="text-sm text-zinc-400 text-center py-8">Sin datos</p>
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-700" />
                      <XAxis dataKey="nombre" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip />
                      <Bar dataKey="ventas" fill="#6366f1" name="Ventas" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
            <CardHeader><CardTitle className="text-lg">Tabla de Ventas por Empleado</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empleado</TableHead>
                    <TableHead className="text-right">Ventas</TableHead>
                    <TableHead className="text-right">Monto Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center text-zinc-400 py-8">Sin datos</TableCell>
                    </TableRow>
                  ) : (
                    data?.map((v) => (
                      <TableRow key={v.idEmpleado}>
                        <TableCell className="font-medium">{v.empleado}</TableCell>
                        <TableCell className="text-right">{v.totalVentas}</TableCell>
                        <TableCell className="text-right font-semibold">${Number(v.montoTotal).toFixed(2)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
