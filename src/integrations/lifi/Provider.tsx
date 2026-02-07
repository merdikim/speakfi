import { ChainType, EVM, config, createConfig, getChains } from '@lifi/sdk'
import { useSyncWagmiConfig } from '@lifi/wallet-management'
import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import { useQuery } from '@tanstack/react-query'
import { getWalletClient, switchChain } from '@wagmi/core'
import { type FC, type PropsWithChildren } from 'react'
import { createClient, http } from 'viem'
import { base, mainnet, optimism, polygon } from 'viem/chains'
import type { Config } from 'wagmi'
import { WagmiProvider, createConfig as createWagmiConfig } from 'wagmi'
import {
  rainbowWallet,
  walletConnectWallet,
  metaMaskWallet
} from '@rainbow-me/rainbowkit/wallets';

const connectors = connectorsForWallets(
  [
    {
      groupName: 'Suggested',
      wallets: [rainbowWallet, walletConnectWallet, metaMaskWallet],
    },
  ],
  {
    appName: 'SpeakFi',
    projectId: 'YOUR_PROJECT_ID',
  }
);

const wagmiConfig: Config = createWagmiConfig({
  chains: [mainnet, optimism, base, polygon],
  client({ chain }) {
    return createClient({ chain, transport: http() })
  },
})

createConfig({
  integrator: 'SpeakFi',
  providers: [
    EVM({
      getWalletClient: () => getWalletClient(wagmiConfig),
      switchChain: async (chainId) => {
        const chain = await switchChain(wagmiConfig, { chainId })
        return getWalletClient(wagmiConfig, { chainId: chain.id })
      },
    }),
  ],
  // We disable chain preloading and will update chain configuration in runtime
  preloadChains: false,
})

export const CustomWagmiProvider: FC<PropsWithChildren> = ({ children }) => {
  // Load EVM chains from LI.FI API using getChains action from LI.FI SDK
  const { data: chains } = useQuery({
    queryKey: ['chains'] as const,
    queryFn: async () => {
      const chains = await getChains({
        chainTypes: [ChainType.EVM],
      })
      // Update chain configuration for LI.FI SDK
      config.setChains(chains)
      return chains
    },
  })

  // Synchronize fetched chains with Wagmi config and update connectors
  useSyncWagmiConfig(wagmiConfig, connectors, chains)

  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
      {children}
    </WagmiProvider>
  )
}
