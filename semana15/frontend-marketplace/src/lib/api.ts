export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// La API devuelve los DECIMAL de MySQL como texto, por eso se convierte antes de formatear.
export const formatPrice = (precio: number) => `S/ ${Number(precio).toFixed(2)}`;

export const formatSku = (id: number) => `N.º ${String(id).padStart(4, '0')}`;

export const authHeader = (token?: string): Record<string, string> =>
  token ? { Authorization: `Bearer ${token}` } : {};
