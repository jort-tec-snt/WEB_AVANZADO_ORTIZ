import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="shell max-w-4xl py-12">
      <div className="sheet p-8">
        <p className="eyebrow mb-3">Error 404</p>
        <h1 className="title mb-6">No encontramos esa página</h1>
        <Link href="/" className="link">← Volver a productos</Link>
      </div>
    </div>
  );
}
