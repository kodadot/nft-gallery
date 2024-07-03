import { defaultWagmiConfig } from '@web3modal/wagmi/vue'
import { base, immutableZkEvm } from 'viem/chains'
import { reconnect } from '@wagmi/core'
import { useAccount, useDisconnect } from 'use-wagmi'
import { DisconnectMutateAsync } from 'use-wagmi/query'

const buildWagmiConfig = () => {
  const metadata = {
    name: 'KodaDot',
    description: 'KodaDot - Generative Art Marketplace',
    url: 'https://kodadot.xyz/',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
  }

  const chains = [base, immutableZkEvm]

  return defaultWagmiConfig({
    chains,
    projectId: useRuntimeConfig().public.walletConnectProjectId,
    metadata,
  })
}

const config = buildWagmiConfig() as any

export default () => {
  reconnect(config)

  const { isConnected, address, isConnecting, chainId } = useAccount({
    config,
  })

  const disconnect = useNuxtApp().runWithContext(
    () => useDisconnect({ config }).disconnectAsync,
  ) as Promise<DisconnectMutateAsync>

  return { config, isConnected, isConnecting, address, disconnect, chainId }
}
