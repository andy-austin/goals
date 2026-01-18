'use client';

import { GoalsProvider } from '@/context';
import { ToastProvider } from '@/components/ui';
import type { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <GoalsProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </GoalsProvider>
  );
}
