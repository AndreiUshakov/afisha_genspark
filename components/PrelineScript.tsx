'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Импортируем Preline динамически
import('preline/preline');

declare global {
  interface Window {
    HSStaticMethods: {
      autoInit(): void;
    };
  }
}

export default function PrelineScript() {
  const path = usePathname();

  useEffect(() => {
    const loadPreline = async () => {
      await import('preline/preline');
      
      if (window.HSStaticMethods) {
        window.HSStaticMethods.autoInit();
      }
    };

    loadPreline();
  }, [path]);

  return null;
}
