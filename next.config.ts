import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Product photos uploaded in the NETICS console are served by NETICS.
      { protocol: "https", hostname: "business.neticsai.com", pathname: "/api/public/**" },
      // Older product images uploaded through the previous admin panel.
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
};

export default nextConfig;
