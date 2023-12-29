import React from 'react';

import FlowRateComponent from '@/components/SF_FlowRateComponent/FlowRateComponent';
import { WalletConnect } from '@/components/blockchain/wallet-connect';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <WalletConnect />
      <FlowRateComponent />
    </main>
  );
}
