'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import type { CreateEventoRequest, Evento } from '@/types/eventos.types';

interface EventoFormProps {
  initial?: Evento;
  onSubmit: (data: CreateEventoRequest) => void;
  isPending: boolean;
}

export function EventoForm({ initial, onSubmit, isPending }: EventoFormProps) {
  const [nombreEvento, setNombreEvento] = useState(initial?.nombreEvento ?? '');
  const [fechaEvento, setFechaEvento] = useState(initial?.fechaEvento ?? '');
  const [descripcion, setDescripcion] = useState(initial?.descripcion ?? '');
  const [lugar, setLugar] = useState(initial?.lugar ?? '');
  const [capacidadMaxima, setCapacidadMaxima] = useState(initial?.capacidadMaxima?.toString() ?? '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      nombreEvento,
      fechaEvento,
      descripcion: descripcion || undefined,
      lugar: lugar || undefined,
      capacidadMaxima: capacidadMaxima ? parseInt(capacidadMaxima, 10) : undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre del evento</Label>
        <Input id="nombre" value={nombreEvento} onChange={(e) => setNombreEvento(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="fecha">Fecha</Label>
        <Input id="fecha" type="date" value={fechaEvento} onChange={(e) => setFechaEvento(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="descripcion">Descripción</Label>
        <Textarea id="descripcion" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={3} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lugar">Lugar</Label>
        <Input id="lugar" value={lugar} onChange={(e) => setLugar(e.target.value)} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="capacidad">Capacidad máxima</Label>
        <Input id="capacidad" type="number" min={1} value={capacidadMaxima} onChange={(e) => setCapacidadMaxima(e.target.value)} placeholder="Sin límite" />
      </div>
      <Button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer gap-2">
        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
        {initial ? 'Actualizar evento' : 'Crear evento'}
      </Button>
    </form>
  );
}
