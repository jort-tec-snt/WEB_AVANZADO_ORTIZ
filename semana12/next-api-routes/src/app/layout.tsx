import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { Fraunces, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], style: ["normal", "italic"] });
const plex = IBM_Plex_Sans({ variable: "--font-plex", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "Fichero | Biblioteca de autores",
  description: "Catálogo de autores y libros con Next.js, Prisma y Supabase.",
};

// La interfaz es de papel claro: se declara "only light" para que el navegador no aplique oscurecimiento forzado.
export const viewport: Viewport = { colorScheme: "only light" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${fraunces.variable} ${plex.variable}`}>
      <body>
        <Suspense fallback={<header className="nav" style={{ height: "3.5rem" }} />}>
          <Navbar />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
