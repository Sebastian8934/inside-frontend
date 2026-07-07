import type { NextConfig } from "next";

const apiProxyTarget =
  process.env.API_PROXY_TARGET ?? "http://localhost:5033";

const nextConfig: NextConfig = {
  turbopack: {
    root: import.meta.dirname,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
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
