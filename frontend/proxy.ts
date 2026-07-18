import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/login', '/registro'];
const publicReadRoutes = ['/catalogo'];
const clientRoutes = ['/perfil', '/mis-prestamos', '/mis-reservas', '/mis-descargas', '/membresias'];
const dashboardRoutes = [
  '/dashboard', '/catalogo-admin', '/prestamos', '/reservas',
  '/ventas', '/usuarios', '/empleados', '/roles-empleado',
  '/proveedores', '/presupuestos', '/ordenes-compra',
  '/biblioteca-digital', '/dispositivos', '/eventos', '/reportes',
];

function matchPath(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(prefix + '/');
}

function decodeToken(token: string) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === '/') return NextResponse.next();

  const token = request.cookies.get('auth_token')?.value;
  const payload = token ? decodeToken(token) : null;
  const tipo: string | null = payload?.tipo ?? null;

  if (publicRoutes.some((r) => matchPath(pathname, r))) {
    if (token) return NextResponse.redirect(new URL('/', request.url));
    return NextResponse.next();
  }

  if (publicReadRoutes.some((r) => matchPath(pathname, r))) {
    return NextResponse.next();
  }

  if (clientRoutes.some((r) => matchPath(pathname, r))) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (tipo !== 'usuario') return NextResponse.redirect(new URL('/', request.url));
    return NextResponse.next();
  }

  if (dashboardRoutes.some((r) => matchPath(pathname, r))) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (tipo !== 'empleado') return NextResponse.redirect(new URL('/', request.url));
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
