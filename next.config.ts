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
      {
        protocol: 'http',
        hostname: 'supabase.sober-automation.ru',
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
  // Явно экспортируем переменные окружения для клиента
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  },
  // Пустая конфигурация Turbopack для подавления предупреждения
  turbopack: {},
};

export default nextConfig;
