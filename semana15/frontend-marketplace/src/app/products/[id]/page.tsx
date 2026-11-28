import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Product, ApiResponse } from '@/types/product';
import { API_URL, formatPrice, formatSku } from '@/lib/api';

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`${API_URL}/products/${encodeURIComponent(id)}`, {
      cache: 'no-store',
    });

    if (!res.ok) return null;

    const data: ApiResponse<Product> = await res.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  return (
    <div className="shell max-w-4xl py-12">
      <Link href="/" className="link mb-6 inline-block">
        ← Volver a productos
      </Link>

      <article className="sheet">
        <header className="border-b-2 border-ink p-8">
          <p className="eyebrow mb-3">{formatSku(product.id)}</p>
          <h1 className="title mb-6">{product.nombre}</h1>
          <span className="price-tag text-2xl">{formatPrice(product.precio)}</span>
        </header>

        {product.descripcion && (
          <div className="p-8">
            <h2 className="eyebrow mb-2">Descripción</h2>
            <p className="text-lg leading-relaxed">{product.descripcion}</p>
          </div>
        )}

        <footer className="data border-t-2 border-dashed border-rule px-8 py-4 text-sm text-muted">
          ID del producto: {product.id}
        </footer>
      </article>
    </div>
  );
}
