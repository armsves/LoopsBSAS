import type { Metadata } from 'next';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';

import { inter, manrope } from './fonts';
import './globals.css';
import { getQueryClient } from '@/service/get-query-client';
import { configFetchOptions } from '@/service/configApi';
import { headers } from 'next/headers';
import { Providers } from '@/providers';
import { Suspense } from 'react';
import PageLoading from '@/components/ui/page-loading';
import { Toaster } from '@/components/ui/shadcn/sonner';
import Navbar from '@/components/navbar';

export const metadata: Metadata = {
  title: 'ContribHub - Streamline Your Chain-Love Contributions',
  description: 'Fork, create pull requests, and add RPC endpoints to the Chain-Love repository with ease.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = headers();

  const host = headersList.get('host');

  const origin = `http://${host}`;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(configFetchOptions(origin));

  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={`${inter.variable} ${manrope.variable}`}
    >
      <body>
        <Providers>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <div className='flex min-h-dvh flex-col'>
              <Navbar />
              <Suspense fallback={<PageLoading />}>{children}</Suspense>

              <Toaster />
            </div>
          </HydrationBoundary>
        </Providers>
      </body>
    </html>
  );
}
