import { ApiResponse } from '@/types/product';
import { User } from '@/types/user';
import { authHeader } from '@/lib/api';

// La API valida el token y devuelve el rol vigente; el frontend no conoce la clave JWT.
export async function fetchUser(apiUrl: string, token: string) {
  try {
    const res = await fetch(`${apiUrl}/auth/me`, {
      cache: 'no-store',
      headers: authHeader(token),
    });
    if (!res.ok) return { user: null, expired: res.status === 401 };
    const data: ApiResponse<User> = await res.json();
    return { user: data.data, expired: false };
  } catch (error) {
    console.error('Error validating session:', error);
    return { user: null, expired: false };
  }
}
