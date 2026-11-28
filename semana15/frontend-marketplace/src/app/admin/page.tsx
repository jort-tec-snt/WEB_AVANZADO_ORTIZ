'use client';

import { useState, useEffect, useCallback } from 'react';
import { Product, ApiResponse } from '@/types/product';
import { API_URL, formatPrice } from '@/lib/api';

const EMPTY_FORM = { nombre: '', precio: '', descripcion: '' };

async function requestProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/products`, { cache: 'no-store' });
  const data: ApiResponse<Product[]> = await res.json();
  return data.success ? data.data : [];
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const fetchProducts = useCallback(
    () =>
      requestProducts()
        .then(setProducts)
        .catch(() => setError('No se pudo conectar con la API'))
        .finally(() => setLoading(false)),
    [],
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Envía una operación de escritura y muestra el mensaje de la API si falla.
  const send = async (url: string, init: RequestInit) => {
    setError('');
    try {
      const res = await fetch(url, init);
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.message ?? 'No se pudo completar la operación');
        return false;
      }
      await fetchProducts();
      return true;
    } catch {
      setError('No se pudo conectar con la API');
      return false;
    }
  };

  const handleCancel = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const url = editingId
      ? `${API_URL}/products/${editingId}`
      : `${API_URL}/products`;
    const ok = await send(url, {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: formData.nombre,
        precio: parseFloat(formData.precio),
        descripcion: formData.descripcion,
      }),
    });
    if (ok) handleCancel();
  };

  const handleEdit = (product: Product) => {
    setFormData({
      nombre: product.nombre,
      precio: product.precio.toString(),
      descripcion: product.descripcion || '',
    });
    setEditingId(product.id);
  };

  // El primer clic pide confirmación en la misma fila; el segundo elimina.
  const handleDelete = async (id: number) => {
    if (deletingId !== id) {
      setDeletingId(id);
      return;
    }
    await send(`${API_URL}/products/${id}`, { method: 'DELETE' });
    setDeletingId(null);
    if (editingId === id) handleCancel();
  };

  if (loading) {
    return <div className="shell eyebrow py-12 text-center">Cargando…</div>;
  }

  return (
    <div className="shell py-12">
      <h1 className="title mb-8">Administración de productos</h1>

      {error && <p role="alert" className="notice mb-6">{error}</p>}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <section className="sheet self-start p-6 lg:col-span-1">
          <h2 className="mb-4 text-2xl font-bold">
            {editingId ? 'Editar producto' : 'Crear producto'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nombre" className="field-label">Nombre</label>
              <input
                id="nombre"
                type="text"
                required
                maxLength={100}
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="field"
              />
            </div>
            <div>
              <label htmlFor="precio" className="field-label">Precio (S/)</label>
              <input
                id="precio"
                type="number"
                step="0.01"
                min="0.01"
                required
                value={formData.precio}
                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                className="field data"
              />
            </div>
            <div>
              <label htmlFor="descripcion" className="field-label">Descripción</label>
              <textarea
                id="descripcion"
                rows={3}
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="field"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary flex-1">
                {editingId ? 'Actualizar' : 'Crear'}
              </button>
              {editingId && (
                <button type="button" onClick={handleCancel} className="btn-ghost">
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="sheet overflow-x-auto lg:col-span-2">
          <table className="w-full">
            <thead className="border-b-2 border-ink">
              <tr className="eyebrow">
                <th className="px-6 py-3 text-left">Nombre</th>
                <th className="px-6 py-3 text-right">Precio</th>
                <th className="px-6 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rule">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-paper">
                  <td className="px-6 py-4 font-bold">{product.nombre}</td>
                  <td className="data px-6 py-4 text-right whitespace-nowrap">
                    {formatPrice(product.precio)}
                  </td>
                  <td className="px-6 py-4 text-right whitespace-nowrap">
                    <button onClick={() => handleEdit(product)} className="link mr-4">
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      onBlur={() => setDeletingId(null)}
                      className="link-danger"
                    >
                      {deletingId === product.id ? '¿Confirmar?' : 'Eliminar'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}
