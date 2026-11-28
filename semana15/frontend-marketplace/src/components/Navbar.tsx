import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="border-b-2 border-ink bg-sheet">
      <div className="shell flex h-16 items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold tracking-tight">
          Product<span className="text-signal">Store</span>
        </Link>
        <div className="flex gap-6">
          <Link href="/" className="link">Productos</Link>
          <Link href="/admin" className="link">Admin</Link>
        </div>
      </div>
    </nav>
  );
}
