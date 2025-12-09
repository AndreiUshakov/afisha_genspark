import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Увеличиваем лимит для загрузки файлов
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Пустая конфигурация Turbopack для подавления предупреждения
  turbopack: {},
};

export default nextConfig;
