import { defaultWagmiConfig } from '@web3modal/wagmi/vue'
import { base, immutableZkEvm } from 'viem/chains'
import { reconnect as reconnectWagmi } from '@wagmi/core'
import { useAccount, useDisconnect } from 'use-wagmi'
import type { DisconnectMutateAsync } from 'use-wagmi/query'

export const buildWagmiConfig = () => {
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

export default (
  { reconnect }: { reconnect: boolean } = { reconnect: false },
) => {
  const { $wagmiConfig: config } = useNuxtApp()

  if (reconnect) {
    reconnectWagmi(config)
  }

  const account = useAccount({
    config,
  })

  const disconnect = useNuxtApp().runWithContext(
    () => useDisconnect({ config }).disconnectAsync,
  ) as Promise<DisconnectMutateAsync>

  return {
    ...account,
    disconnect,
  }
}
