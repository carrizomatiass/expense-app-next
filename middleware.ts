import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  console.log('Middleware ejecutándose para:', request.nextUrl.pathname);

  const token = request.cookies.get('auth-token')?.value;
  console.log('Token encontrado:', token ? 'SI' : 'NO');

  // Si está accediendo a /expenses y rutas protegidas
  if (request.nextUrl.pathname.startsWith('/expenses')) {
    if (!token) {
      console.log('No hay token, redirigiendo a login');
      return NextResponse.redirect(
        new URL('/login?error=auth_required', request.url)
      );
    }

    try {
      console.log('Token válido, permitiendo acceso');
      return NextResponse.next();
    } catch (error) {
      console.log('Token inválido:', error);
      // Token inválido, limpiar cookie y redirigir
      const response = NextResponse.redirect(
        new URL('/login?error=invalid_token', request.url)
      );
      response.cookies.delete('auth-token');
      return response;
    }
  }

  // Si está accediendo a login o register con token válido, redirigir a expenses
  if (
    (request.nextUrl.pathname === '/login' ||
      request.nextUrl.pathname === '/register') &&
    token
  ) {
    try {
      jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
      console.log('Usuario ya autenticado, redirigiendo a expenses');
      return NextResponse.redirect(new URL('/expenses', request.url));
    } catch (error) {
      // Token inválido, permitir acceso a login/register
      console.log('Token inválido en login, limpiando cookie');
      const response = NextResponse.next();
      response.cookies.delete('auth-token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/expenses/:path*', '/login', '/register'],
};
