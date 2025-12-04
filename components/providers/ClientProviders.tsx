'use client';

import { AudioProvider } from '@/contexts/AudioContext';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AudioProvider>{children}</AudioProvider>;
}