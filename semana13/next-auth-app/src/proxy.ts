// Next.js 16 renombro "middleware" a "proxy". Aplica el mapa de rutas de src/lib/routes.ts.
import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { ROUTES, matches } from "@/lib/routes";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token && matches(ROUTES.protected, pathname)) {
    const url = new URL(ROUTES.login, req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }
  if (token && matches(ROUTES.guestOnly, pathname)) {
    return NextResponse.redirect(new URL(ROUTES.home, req.url));
  }
  return NextResponse.next();
}

export const config = { matcher: ["/dashboard/:path*", "/profile/:path*", "/signIn/:path*", "/register/:path*"] };
