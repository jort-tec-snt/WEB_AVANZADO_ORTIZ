import './globals.css';
import type { Metadata } from 'next';
import { Bricolage_Grotesque, IBM_Plex_Mono } from 'next/font/google';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display' });
const data = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '600'], variable: '--font-data' });

export const metadata: Metadata = {
  title: 'ProductStore',
  description: 'Gestión de productos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${display.variable} ${data.variable}`}>
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
