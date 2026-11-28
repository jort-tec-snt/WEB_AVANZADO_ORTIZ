import Link from 'next/link';
import { Product, ApiResponse } from '@/types/product';
import { API_URL, formatPrice, formatSku } from '@/lib/api';
import { serverAuthHeader } from '@/lib/auth-server';

async function getProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/products`, {
      cache: 'no-store',
      headers: await serverAuthHeader(),
    });

    if (!res.ok) return [];

    const data: ApiResponse<Product[]> = await res.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ denegado?: string }>;
}) {
  const { denegado } = await searchParams;
  const products = await getProducts();

  return (
    <div className="shell py-12">
      {denegado && (
        <p role="alert" className="notice mb-6">
          Tu rol no tiene acceso a esa página.
        </p>
      )}

      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <h1 className="title">Productos</h1>
        <p className="eyebrow">{products.length} en catálogo</p>
      </header>

      {products.length === 0 ? (
        <div className="sheet py-12 text-center">
          <p className="text-muted">No hay productos disponibles</p>
        </div>
      ) : (
        <ul className="grid grid-cols-1 border-t-2 border-l-2 border-ink sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <li key={product.id} className="border-r-2 border-b-2 border-ink bg-sheet">
              <Link
                href={`/products/${product.id}`}
                className="group flex h-full flex-col gap-3 p-6 transition-colors hover:bg-ink hover:text-sheet"
              >
                <span className="eyebrow group-hover:text-rule">{formatSku(product.id)}</span>
                <h2 className="text-2xl leading-tight font-bold">{product.nombre}</h2>
                {product.descripcion && (
                  <p className="line-clamp-2 text-sm text-muted group-hover:text-rule">
                    {product.descripcion}
                  </p>
                )}
                <p className="mt-auto pt-3">
                  <span className="price-tag text-lg">{formatPrice(product.precio)}</span>
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
