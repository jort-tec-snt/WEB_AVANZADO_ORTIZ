import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

// En desarrollo, el hot reload recrearia el cliente (y el pool) en cada cambio.
// Se guarda en globalThis para reutilizar una sola instancia.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // En Vercel cada funcion serverless abre su propio pool. El Session pooler de
    // Supabase admite pocas conexiones (EMAXCONNSESSION), asi que en produccion
    // se limita a 1 conexion por instancia y se cierran rapido las inactivas.
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL,
      ...(process.env.NODE_ENV === "production" && {
        max: 1,
        idleTimeoutMillis: 10_000,
      }),
    }),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
