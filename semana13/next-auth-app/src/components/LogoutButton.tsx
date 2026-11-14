"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: "/signIn" })} className="btn btn--ghost btn--sm">
      Cerrar Sesión
    </button>
  );
}
