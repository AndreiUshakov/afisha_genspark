'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export default function ConditionalFooter() {
  const pathname = usePathname();
  
  // Не показываем футер на страницах dashboard и admin
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    return null;
  }
  
  return <Footer />;
}