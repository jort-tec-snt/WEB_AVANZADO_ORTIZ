// El token se guarda en una cookie del dominio del frontend: así lo leen el proxy,
// los componentes de servidor y el navegador (que lo envía a la API).
export const SESSION_COOKIE = 'ps_session';

const MAX_AGE = 60 * 60 * 2; // igual que la expiración del JWT

const writeCookie = (value: string, maxAge: number) => {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${SESSION_COOKIE}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
};

export const saveToken = (token: string) => writeCookie(encodeURIComponent(token), MAX_AGE);

export const clearToken = () => writeCookie('', 0);

export const readToken = () => {
  const entry = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${SESSION_COOKIE}=`));
  return entry ? decodeURIComponent(entry.slice(SESSION_COOKIE.length + 1)) : '';
};
