'use client';

import { AuthProvider } from '@/context';
import { GoalsProvider } from '@/context';
import { SpacesProvider } from '@/context';
import { ToastProvider } from '@/components/ui';
import type { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <GoalsProvider>
        <SpacesProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </SpacesProvider>
      </GoalsProvider>
    </AuthProvider>
  );
}
