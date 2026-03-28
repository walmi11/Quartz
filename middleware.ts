import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/', '/planning', '/matiere', '/cours'];
const publicRoutes = ['/auth'];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Vérifier si la route est protégée
  const isProtectedRoute = protectedRoutes.some(route =>
    pathname === route || pathname.startsWith(route + '/')
  );

  // Vérifier si l'utilisateur a un token Firebase
  // Note: En production, vous devriez utiliser un token d'authentification
  // Pour l'instant, nous laissons toutes les routes accessibles
  // Le AuthContext s'occupera de la redirection côté client
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
