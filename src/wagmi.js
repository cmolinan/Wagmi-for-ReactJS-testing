import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { injected, metaMask, coinbaseWallet } from 'wagmi/connectors'

import { defineChain } from 'viem'

export const iotaEvmTestnet = defineChain(
  {
    id: 1075,
    name: 'IOTA EVM Testnet',
    network: 'iotaevm-testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'IOTA',
      symbol: 'IOTA',
    },
    rpcUrls: {
      default: {
        http: ['https://json-rpc.evm.testnet.iotaledger.net'],
        webSocket: ['wss://ws.json-rpc.evm.testnet.iotaledger.net'],
      },
    },
    blockExplorers: {
      default: {
        name: 'Explorer',
        url: 'https://explorer.evm.testnet.iotaledger.net',
        apiUrl: 'https://explorer.evm.testnet.iotaledger.net/api',
      },
    },
    testnet: true,
  }
);

export const config = createConfig({
  chains: [mainnet, sepolia, iotaEvmTestnet],
  connectors: [
    injected(),
    metaMask(), 
    coinbaseWallet()    
  ],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [iotaEvmTestnet.id]: http(),
  },
})
