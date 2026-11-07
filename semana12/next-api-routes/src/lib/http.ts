import { NextResponse } from "next/server";

export const fail = (error: string, status = 500) =>
  NextResponse.json({ error }, { status });

// Prisma: P2002 = unique violado, P2025 = registro no encontrado, P2003 = FK invalida
export function prismaError(e: unknown, fallback: string) {
  const code = (e as { code?: string })?.code;
  if (code === "P2002") return fail("Ya existe un registro con ese valor unico (email/isbn)", 409);
  if (code === "P2025") return fail("Registro no encontrado", 404);
  if (code === "P2003") return fail("El autor indicado no existe", 400);
  console.error(fallback, (e as Error)?.message);
  return fail(fallback);
}
