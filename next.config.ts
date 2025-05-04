import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    domains: [
      'utfs.io',
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "axyo18gsui.ufs.sh",
        pathname: "/f/*",
      },
      {
        protocol: "https",
        hostname: "findwork-webapp.vercel.app",
        pathname: "/**",
      },
    ],
  }
};

export default nextConfig;
