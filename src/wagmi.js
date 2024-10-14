import { rainbowWallet, metaMaskWallet, coinbaseWallet } from '@rainbow-me/rainbowkit/wallets';
import { getDefaultConfig, connectorsForWallets } from '@rainbow-me/rainbowkit';

import { mainnet, sepolia } from 'wagmi/chains'

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

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Suggested',
      wallets: [      
        metaMaskWallet,
        coinbaseWallet,        
      ],
    },
  ],
  {
    appName: 'My RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
  }
);

export const config = getDefaultConfig({
  connectors,
  projectId: 'void',
  chains: [mainnet, sepolia, iotaEvmTestnet],
});

