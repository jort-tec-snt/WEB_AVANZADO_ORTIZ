import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Politica de bloqueo: tras MAX_ATTEMPTS fallos seguidos la cuenta se bloquea.
export const MAX_ATTEMPTS = 5;
export const LOCK_MINUTES = 15;

// Hash falso para que el tiempo de respuesta sea similar cuando el correo no existe.
const DUMMY_HASH = bcrypt.hashSync("dummy-password", 12);

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/signIn", error: "/signIn" },
  callbacks: {
    // "account" solo llega en el primer login: se guarda el metodo de acceso en el JWT.
    async jwt({ token, account }) {
      if (account) token.provider = account.provider;
      return token;
    },
    async session({ session, token }) {
      session.user.provider = token.provider;
      session.user.id = token.sub;
      return session;
    },
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credenciales",
      credentials: {
        email: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;
        if (!email || !password) throw new Error("MISSING_FIELDS");

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          await bcrypt.compare(password, DUMMY_HASH);
          throw new Error("INVALID_CREDENTIALS");
        }

        // Cuenta bloqueada: no se evalua la contraseña hasta que expire el bloqueo.
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          const minutes = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60_000);
          throw new Error(`LOCKED:${minutes}`);
        }

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) {
          // Si el bloqueo anterior ya expiro, el conteo reinicia desde 1.
          const previous = user.lockedUntil ? 0 : user.failedAttempts;
          const attempts = previous + 1;
          const locked = attempts >= MAX_ATTEMPTS;
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedAttempts: attempts,
              lockedUntil: locked ? new Date(Date.now() + LOCK_MINUTES * 60_000) : null,
            },
          });
          if (locked) throw new Error(`LOCKED:${LOCK_MINUTES}`);
          throw new Error(`INVALID_CREDENTIALS:${MAX_ATTEMPTS - attempts}`);
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { failedAttempts: 0, lockedUntil: null },
        });
        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
};
