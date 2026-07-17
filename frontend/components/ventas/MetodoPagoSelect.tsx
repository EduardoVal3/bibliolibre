'use client';

import { NativeSelect } from '@/components/ui/native-select';
import type { MetodoPago } from '@/types/ventas.types';

export function MetodoPagoSelect({
  metodos, value, onChange, disabled,
}: {
  metodos: MetodoPago[];
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <NativeSelect value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}>
      <option value="">Seleccionar método de pago...</option>
      {metodos.map((m) => (
        <option key={m.idMetodoPago} value={m.idMetodoPago}>{m.nombreMetodo}</option>
      ))}
    </NativeSelect>
  );
}
