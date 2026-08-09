import type { NextConfig } from "next";

const apiProxyTarget =
  process.env.API_PROXY_TARGET ?? "http://localhost:5033";

const nextConfig: NextConfig = {
  // Paquete más liviano para Azure App Service (node server.js).
  output: "standalone",
  turbopack: {
    root: import.meta.dirname,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        // Build-time: definir API_PROXY_TARGET en GitHub Actions / Azure.
        // Ej: https://inside-back-….azurewebsites.net
        destination: `${apiProxyTarget}/api/:path*`,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/configuracion",
        destination: "/administracion",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
