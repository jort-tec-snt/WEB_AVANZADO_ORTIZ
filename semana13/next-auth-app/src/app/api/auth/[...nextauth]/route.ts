import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// authOptions vive en src/lib/auth.ts: un route.ts de Next.js solo puede exportar handlers HTTP.
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
