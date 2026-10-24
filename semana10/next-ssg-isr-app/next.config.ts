import type { NextConfig } from "next";

// Sin cacheComponents: el lab evalúa ISR con `revalidate` y SSG con
// `generateStaticParams`, que pertenecen al modelo de caché clásico.
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/PokeAPI/sprites/**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
