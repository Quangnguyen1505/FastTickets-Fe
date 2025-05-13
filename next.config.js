/** @type {import('next').NextConfig} */
const nextI18nextConfig  = require('./next-i18next.config');
const nextConfig = {
  i18n: nextI18nextConfig.i18n,
  reactStrictMode: true,
  images: {
    domains: ["res.cloudinary.com", 'lh3.googleusercontent.com'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dare4eibk/image/upload/**",
      },
      {
        protocol: "http",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/dare4eibk/image/upload/**",
      },
    ],
  },
};

module.exports = nextConfig;