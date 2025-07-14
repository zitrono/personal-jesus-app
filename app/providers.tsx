'use client';

import { ClientProviders } from '@/components/ClientProviders';
import { ServiceWorkerRegistration } from '@/components/ServiceWorkerRegistration';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ServiceWorkerRegistration />
      <ClientProviders>{children}</ClientProviders>
    </>
  );
}