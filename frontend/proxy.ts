import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/login', '/registro'];
const protectedRoutes = ['/dashboard', '/catalogo', '/perfil', '/usuarios', '/membresias', '/proveedores', '/presupuestos', '/ordenes-compra', '/biblioteca-digital', '/dispositivos', '/mis-descargas', '/eventos'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth_token')?.value;

  const isPublic = publicRoutes.some((r) => pathname.startsWith(r));
  const isProtected = protectedRoutes.some((r) => pathname.startsWith(r));

  if (isPublic && token) {
    return NextResponse.redirect(new URL('/catalogo', request.url));
  }

  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
