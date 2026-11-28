import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';
import { getCurrentUser } from '@/lib/auth-server';

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <nav className="border-b-2 border-ink bg-sheet">
      <div className="shell flex min-h-16 flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2">
        <Link href="/" className="text-2xl font-extrabold tracking-tight">
          Product<span className="text-signal">Store</span>
        </Link>
        <div className="flex flex-wrap items-center gap-6">
          {user ? (
            <>
              <Link href="/" className="link">Productos</Link>
              {user.role === 'ADMIN' && <Link href="/admin" className="link">Admin</Link>}
              <span className="eyebrow">
                {user.nombre} · {user.role}
              </span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="link">Ingresar</Link>
              <Link href="/register" className="link">Crear cuenta</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
