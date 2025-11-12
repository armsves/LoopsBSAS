// app/layout.jsx
"use client";

import "./globals.css";
import { WagmiProvider, serialize, deserialize } from "wagmi";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";

import "@rainbow-me/rainbowkit/styles.css";
import * as React from "react";
import { Navbar } from "@/components/ui/Navbar";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { ConfettiProvider } from "@/providers/ConfettiProvider";
import { ConfigProvider } from "@/providers/ConfigProvider";
import { GeolocationProvider } from "@/providers/GeolocationProvider";
import { config } from "@/services/wagmi";
import { calibration } from '@filoz/synapse-core/chains';
import { Toaster } from "@/components/ui/shadcn/sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
      networkMode: "offlineFirst",
      retry: false,
    },
  },
});

const localStoragePersister = createSyncStoragePersister({
  storage: typeof window !== "undefined" ? window.localStorage : null,
  key: "filecoin-onchain-cloud-dapp-cache",
  serialize,
  deserialize,
});
persistQueryClient({
  queryClient: queryClient,
  persister: localStoragePersister,
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>ContribHub - Contribute Web3 Tools with AI Validation & Cross-Chain Rewards</title>
        <meta
          name="description"
          content="User-friendly platform to contribute Web3 tools to an open-source repository. Contributions stored on IPFS, analyzed by AI, and rewarded with cross-chain payments on your preferred network."
        />
        <meta
          name="keywords"
          content="Web3, blockchain, RPC, wallets, explorers, bridges, oracles, dev tools"
        />
        <meta name="author" content="FIL-Builders" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/filecoin.svg" />
      </head>
      <body className="dark">
        <GeolocationProvider
          onBlocked={(info: any) => {
            console.log("blocked", info);
          }}
        >
          <ConfigProvider>
            <ThemeProvider>
              <ConfettiProvider>
                <QueryClientProvider client={queryClient}>
                  <WagmiProvider config={config}>
                    <RainbowKitProvider
                      modalSize="compact"
                      initialChain={calibration}
                      theme={darkTheme({
                        accentColor: '#FF6A00',
                        accentColorForeground: 'white',
                        borderRadius: 'medium',
                        fontStack: 'system',
                      })}
                    >
                      <main className="flex flex-col min-h-screen">
                        <Navbar />
                        {children}
                      </main>
                      <Toaster />
                    </RainbowKitProvider>
                  </WagmiProvider>
                </QueryClientProvider>
              </ConfettiProvider>
            </ThemeProvider>
          </ConfigProvider>
        </GeolocationProvider>
      </body>
    </html>
  );
}
