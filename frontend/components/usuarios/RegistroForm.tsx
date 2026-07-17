'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { NativeSelect } from '@/components/ui/native-select';
import { Loader2 } from 'lucide-react';
import { usuariosApi } from '@/lib/api/usuarios.api';
import { toast } from 'sonner';

export function RegistroForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    pNombre: '', sNombre: '', pApellido: '', sApellido: '',
    correo: '', telefono: '', direccion: '',
    password: '', confirmPassword: '',
    idTipoUsuario: 1, idMembresia: 1,
  });
  const [loading, setLoading] = useState(false);

  const { data: tiposUsuario } = useQuery({
    queryKey: ['tipos-usuario'],
    queryFn: () => usuariosApi.tiposUsuario.getAll(),
  });

  const { data: membresias } = useQuery({
    queryKey: ['membresias'],
    queryFn: () => usuariosApi.membresias.getAll(),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === 'idTipoUsuario' || name === 'idMembresia' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    if (form.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      await usuariosApi.auth.registro({
        pNombre: form.pNombre,
        sNombre: form.sNombre || undefined,
        pApellido: form.pApellido,
        sApellido: form.sApellido || undefined,
        correo: form.correo,
        telefono: form.telefono || undefined,
        direccion: form.direccion || undefined,
        password: form.password,
        idTipoUsuario: form.idTipoUsuario,
        idMembresia: form.idMembresia,
      });
      toast.success('Registro exitoso. Ahora puedes iniciar sesión.');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  const tipos = Array.isArray(tiposUsuario) ? tiposUsuario : [];
  const membs = Array.isArray(membresias) ? membresias : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pNombre">Nombre *</Label>
          <Input id="pNombre" name="pNombre" value={form.pNombre} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sNombre">Segundo nombre</Label>
          <Input id="sNombre" name="sNombre" value={form.sNombre} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="pApellido">Apellido *</Label>
          <Input id="pApellido" name="pApellido" value={form.pApellido} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sApellido">Segundo apellido</Label>
          <Input id="sApellido" name="sApellido" value={form.sApellido} onChange={handleChange} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="correo">Correo electrónico *</Label>
        <Input id="correo" name="correo" type="email" value={form.correo} onChange={handleChange} required />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono</Label>
          <Input id="telefono" name="telefono" value={form.telefono} onChange={handleChange} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="direccion">Dirección</Label>
          <Input id="direccion" name="direccion" value={form.direccion} onChange={handleChange} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="idTipoUsuario">Tipo de usuario *</Label>
          <NativeSelect id="idTipoUsuario" name="idTipoUsuario" value={form.idTipoUsuario} onChange={handleChange}>
            {tipos.map((t) => (
              <option key={t.idTipoUsuario} value={t.idTipoUsuario}>{t.nombreTipo}</option>
            ))}
          </NativeSelect>
        </div>
        <div className="space-y-2">
          <Label htmlFor="idMembresia">Membresía *</Label>
          <NativeSelect id="idMembresia" name="idMembresia" value={form.idMembresia} onChange={handleChange}>
            {membs.map((m) => (
              <option key={m.idMembresia} value={m.idMembresia}>{m.nombreMembresia}</option>
            ))}
          </NativeSelect>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña *</Label>
          <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required minLength={6} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar contraseña *</Label>
          <Input id="confirmPassword" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} required />
        </div>
      </div>
      <Button type="submit" className="w-full h-11 cursor-pointer" disabled={loading}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Crear cuenta'}
      </Button>
    </form>
  );
}
