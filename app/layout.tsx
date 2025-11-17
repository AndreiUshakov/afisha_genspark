import type { Metadata } from 'next';
import './globals.css';
import ConditionalHeader from '@/components/layout/ConditionalHeader';
import ConditionalFooter from '@/components/layout/ConditionalFooter';
import PrelineScript from '@/components/PrelineScript';
import { AudioProvider } from '@/contexts/AudioContext';

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
      <body className="antialiased">
        <AudioProvider>
          <ConditionalHeader />
          <main className="min-h-screen">
            {children}
          </main>
          <ConditionalFooter />
        </AudioProvider>
        <PrelineScript />
      </body>
    </html>
  );
}
