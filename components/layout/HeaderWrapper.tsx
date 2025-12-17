'use client';

import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface HeaderWrapperProps {
  children: ReactNode;
}

export default function HeaderWrapper({ children }: HeaderWrapperProps) {
  const pathname = usePathname();
  
  // Не показываем header на страницах dashboard и admin
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    return null;
  }
  
  return <>{children}</>;
}