'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Не показываем футер на страницах dashboard
  if (pathname.startsWith('/dashboard')) {
    return null;
  }
  
  return <Footer />;
}