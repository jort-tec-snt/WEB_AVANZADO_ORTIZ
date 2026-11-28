import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { API_URL } from '@/lib/api';
import { fetchUser } from '@/lib/fetch-user';
import { SESSION_COOKIE } from '@/lib/session';
import { Role } from '@/types/user';

const GUEST_PAGES = ['/login', '/register'];

// Matriz de la guía: CUSTOMER entra a "/" y "/products/[id]"; ADMIN además a "/admin".
const rolesFor = (pathname: string): Role[] =>
  pathname === '/admin' || pathname.startsWith('/admin/') ? ['ADMIN'] : ['CUSTOMER', 'ADMIN'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const { user, expired } = token
    ? await fetchUser(API_URL, token)
    : { user: null, expired: false };

  const redirect = (path: string) => NextResponse.redirect(new URL(path, request.url));

  if (GUEST_PAGES.includes(pathname)) {
    if (user) return redirect('/');
    const response = NextResponse.next();
    if (expired) response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  if (!user) {
    const response = redirect('/login');
    if (expired) response.cookies.delete(SESSION_COOKIE);
    return response;
  }

  if (!rolesFor(pathname).includes(user.role)) {
    return redirect('/?denegado=1');
  }

  return NextResponse.next();
}

export const config = {
  // Todo menos los recursos estáticos.
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
