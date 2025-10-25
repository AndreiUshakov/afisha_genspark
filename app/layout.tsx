import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PrelineScript from '@/components/PrelineScript';

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
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <PrelineScript />
      </body>
    </html>
  );
}
