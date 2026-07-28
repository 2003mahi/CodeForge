/** @type {import('next').NextConfig} */
const nextConfig = {
  // Gzip compression for all served assets
  compress: true,
  // Don't leak server info in response headers
  poweredByHeader: false,
  // Enables React strict mode: catches potential perf issues in dev
  reactStrictMode: true,
};

export default nextConfig;
