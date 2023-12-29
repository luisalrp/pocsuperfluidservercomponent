// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Networks
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
import { Chain, configureChains } from 'wagmi'
import {
  celoAlfajores as celoAlfajoresNoIcon,
  celo as celoNoIcon,
  goerli,
  hardhat,
  polygon,
  polygonMumbai,
} from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { infuraProvider } from 'wagmi/providers/infura'
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from 'wagmi/providers/public'

// import { env } from '@/env.mjs'
const celo = {
  ...celoNoIcon,
  iconUrl: '/icons/NetworkCelo.svg',
}
const celoAlfajores = {
  ...celoAlfajoresNoIcon,
  iconUrl: '/icons/NetworkCeloTest.svg',
}

export const ETH_CHAINS_TEST = [goerli, polygonMumbai, celoAlfajores, hardhat]
export const ETH_CHAINS_PROD = [polygon, celo, goerli]
export const ETH_CHAINS_DEV = process.env.NEXT_PUBLIC_PROD_NETWORKS_DEV === 'true' ? [...ETH_CHAINS_PROD, ...ETH_CHAINS_TEST] : ETH_CHAINS_TEST

export const CHAINS: Chain[] = process.env.NODE_ENV === 'production' ? ETH_CHAINS_PROD : ETH_CHAINS_DEV

const PROVIDERS = []

if (process.env.NEXT_PUBLIC_ALCHEMY_API_KEY) {
  if (!process.env.NEXT_PUBLIC_ALCHEMY_API_KEY) throw new Error('NEXT_PUBLIC_ALCHEMY_API_KEY is not defined')
  PROVIDERS.push(
    alchemyProvider({
      apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    })
  )
}

if (process.env.NEXT_PUBLIC_INFURA_API_KEY) {
  if (!process.env.NEXT_PUBLIC_INFURA_API_KEY) throw new Error('NEXT_PUBLIC_INFURA_API_KEY is not defined')
  PROVIDERS.push(
    infuraProvider({
      apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY,
    })
  )
}

// Fallback to public provider
// Only include public provider if no other providers are available.
if (PROVIDERS.length === 0 || process.env.NEXT_PUBLIC_USE_PUBLIC_PROVIDER === 'true') {
  PROVIDERS.push(publicProvider())
}

export const { chains, publicClient, webSocketPublicClient } = configureChains(CHAINS, PROVIDERS)
