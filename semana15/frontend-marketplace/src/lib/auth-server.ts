import { cache } from 'react';
import { cookies } from 'next/headers';
import { API_URL, authHeader } from '@/lib/api';
import { fetchUser } from '@/lib/fetch-user';
import { SESSION_COOKIE } from '@/lib/session';

export async function serverAuthHeader() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return authHeader(token);
}

// cache() evita repetir la consulta dentro de un mismo renderizado.
export const getCurrentUser = cache(async () => {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const result = await fetchUser(API_URL, token);
  return result.user;
});
