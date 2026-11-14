// Mapa unico de rutas. El proxy y la UI lo consumen para no duplicar reglas.
export const ROUTES = {
  // Solo con sesion. Sin sesion -> /signIn?callbackUrl=<ruta>
  protected: ["/dashboard", "/profile"],
  // Solo invitados. Con sesion -> /dashboard
  guestOnly: ["/signIn", "/register"],
  // Accesibles para todos: /api/auth/* (NextAuth), /api/register (valida sesion por su cuenta)
  public: ["/"],
  home: "/dashboard",
  login: "/signIn",
} as const;

export const matches = (list: readonly string[], path: string) =>
  list.some((r) => path === r || path.startsWith(`${r}/`));
