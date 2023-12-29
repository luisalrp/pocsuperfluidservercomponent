'use client'

import { ReactNode } from 'react';
import { RainbowKit } from './rainbow-kit';


interface RootProviderProps {
  children: ReactNode;
}

export default function RootProvider({ children }: RootProviderProps) {
  <RainbowKit>{children}</RainbowKit>
}

