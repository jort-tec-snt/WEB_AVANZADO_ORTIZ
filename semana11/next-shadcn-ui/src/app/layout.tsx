import type { Metadata } from "next";
import { Geist_Mono, Nunito_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { DataProvider } from "@/lib/data-context";
import { AeroBackground } from "@/components/aero/AeroBackground";

// Dos familias: Nunito Sans (interfaz, humanista y redondeada, afín al Aero) y Geist Mono (cifras).
const nunito = Nunito_Sans({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aero Projects · Dashboard de Proyectos",
  description: "Dashboard de proyectos, equipo y tareas con shadcn/ui y estilo Frutiger Aero.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={cn("h-full antialiased font-sans", nunito.variable, geistMono.variable)}>
      <body className="min-h-full flex flex-col">
        <AeroBackground />
        <DataProvider>{children}</DataProvider>
      </body>
    </html>
  );
}
