import type { Metadata } from 'next';
import './globals.css';
import ConditionalHeader from '@/components/layout/ConditionalHeader';
import ConditionalFooter from '@/components/layout/ConditionalFooter';
import PrelineScript from '@/components/PrelineScript';
import ClientProviders from '@/components/providers/ClientProviders';
import { headers } from 'next/headers';

export const metadata: Metadata = {
  title: 'Город живёт! | Календарь событий города',
  description: 'Городская афиша Иркутска - мероприятия, сообщества, события. Найдите интересные события для всей семьи.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';

  return (
    <html lang="ru">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/jodit@4/es2021/jodit.min.css"
        />
      </head>
      <body className="antialiased">
        <ClientProviders>
          {/* Используем key для принудительного ре-рендера при смене маршрута */}
          <ConditionalHeader key={pathname} pathname={pathname} />
          <main className="min-h-screen">
            {children}
          </main>
          <ConditionalFooter />
        </ClientProviders>
        <PrelineScript />
      </body>
    </html>
  );
}
