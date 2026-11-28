'use client';

import { clearToken } from '@/lib/session';

export default function LogoutButton() {
  const handleLogout = () => {
    clearToken();
    // Recarga completa intencional: descarta lo cacheado de la sesión anterior.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.assign('/login');
  };

  return (
    <button type="button" onClick={handleLogout} className="link">
      Salir
    </button>
  );
}
