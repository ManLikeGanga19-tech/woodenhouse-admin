const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,

  // ✅ REQUIRED FOR NEXT 16 + VERCEL + WEBPACK PLUGINS
  turbopack: {},
};

module.exports = withPWA(nextConfig);
