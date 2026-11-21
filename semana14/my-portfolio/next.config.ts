import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Formatos modernos: AVIF primero, WebP como alternativa
    formats: ['image/avif', 'image/webp'],
    // Anchos generados para distintas resoluciones de dispositivo
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Dominios externos permitidos para next/image
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
