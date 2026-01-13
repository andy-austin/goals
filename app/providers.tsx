'use client';

import { GoalsProvider } from '@/context';
import type { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <GoalsProvider>
      {children}
    </GoalsProvider>
  );
}
