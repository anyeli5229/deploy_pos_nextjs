import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'deploy-pos-nestjs-qag9.onrender.com'
      },
      {
        protocol: 'http',
        hostname: 'res.cloudinary.com'
      }
    ]
  }
};

export default nextConfig;
