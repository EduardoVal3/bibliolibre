'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { usuariosApi } from '@/lib/api/usuarios.api';
import { setTokens } from '@/lib/auth/auth';
import { toast } from 'sonner';

export function LoginForm() {
  const router = useRouter();
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await usuariosApi.auth.login({ correo, password });
      setTokens(res);
      toast.success('Inicio de sesión exitoso');
      if (res.usuario.tipo === 'empleado') {
        router.push('/catalogo-admin');
      } else {
        router.push('/catalogo');
      }
    } catch (err: any) {
      toast.error(err.message || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="correo">Correo electrónico</Label>
        <Input
          id="correo"
          type="email"
          placeholder="tu@correo.com"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
          autoFocus
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <Button type="submit" className="w-full h-11 cursor-pointer" disabled={loading}>
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Iniciar sesión'}
      </Button>
    </form>
  );
}
