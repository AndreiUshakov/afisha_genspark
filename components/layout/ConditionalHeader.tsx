'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';

export default function ConditionalHeader() {
  const pathname = usePathname();
  
  // Не показываем header на страницах dashboard
  if (pathname.startsWith('/dashboard')) {
    return null;
  }
  
  return <Header />;
}