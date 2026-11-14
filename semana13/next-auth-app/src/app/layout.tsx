import type { Metadata } from "next";
import { Nunito_Sans, Geist_Mono } from "next/font/google";
import "./globals.css";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Provider from "@/components/SessionProvider";

const nunito = Nunito_Sans({ variable: "--font-nunito", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AeroGate · Acceso seguro",
  description: "AeroGate: portal de acceso con NextAuth.js, Google, GitHub y credenciales. Estilo Frutiger Aero.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="es" className={`${nunito.variable} ${geistMono.variable}`}>
      <body suppressHydrationWarning>
        <Navbar session={session} />
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
