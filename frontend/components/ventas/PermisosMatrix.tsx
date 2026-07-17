'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import type { RolEmpleado, Permiso } from '@/types/ventas.types';

export function PermisosMatrix({
  roles, permisos, asignaciones, onToggle, loading,
}: {
  roles: RolEmpleado[];
  permisos: Permiso[];
  asignaciones: Record<number, number[]>;
  onToggle: (idRol: number, idPermiso: number) => void;
  loading?: boolean;
}) {
  const [asignando, setAsignando] = useState<{ idRol: number; idPermiso: number } | null>(null);

  const handleToggle = async (idRol: number, idPermiso: number) => {
    setAsignando({ idRol, idPermiso });
    await onToggle(idRol, idPermiso);
    setAsignando(null);
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-zinc-50 dark:bg-zinc-800/50">
            <th className="text-left px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300 border-r border-zinc-200 dark:border-zinc-800">Rol</th>
            {permisos.map((p) => (
              <th key={p.idPermiso} className="px-3 py-3 text-center font-semibold text-zinc-700 dark:text-zinc-300 text-xs whitespace-nowrap border-r border-zinc-200 dark:border-zinc-800 last:border-r-0">
                {p.nombrePermiso}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {roles.map((r) => (
            <tr key={r.idRol} className="border-t border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
              <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-50 border-r border-zinc-200 dark:border-zinc-800 whitespace-nowrap">
                {r.nombreRol}
              </td>
              {permisos.map((p) => {
                const checked = asignaciones[r.idRol]?.includes(p.idPermiso) ?? false;
                const isLoading = asignando?.idRol === r.idRol && asignando?.idPermiso === p.idPermiso;
                return (
                  <td key={p.idPermiso} className="px-3 py-3 text-center border-r border-zinc-200 dark:border-zinc-800 last:border-r-0">
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mx-auto text-indigo-500" />
                    ) : (
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => handleToggle(r.idRol, p.idPermiso)}
                        disabled={loading}
                      />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
