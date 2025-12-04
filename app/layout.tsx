import type { Metadata } from 'next';
import './globals.css';
import ConditionalHeader from '@/components/layout/ConditionalHeader';
import ConditionalFooter from '@/components/layout/ConditionalFooter';
import PrelineScript from '@/components/PrelineScript';
import ClientProviders from '@/components/providers/ClientProviders';

export const metadata: Metadata = {
  title: 'Афиша Иркутска | Календарь событий города',
  description: 'Городская афиша Иркутска - мероприятия, сообщества, события. Найдите интересные события для всей семьи.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
          <ConditionalHeader />
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
