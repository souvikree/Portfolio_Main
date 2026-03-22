/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {},
  webpack: (config) => {
    config.resolve.alias.canvas = false
    return config
  },
  experimental: {
    optimizeCss: true,       // minify CSS
    optimizePackageImports: ['framer-motion', 'lucide-react', '@emailjs/browser'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

export default nextConfig