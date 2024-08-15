import { defaultWagmiConfig } from '@web3modal/wagmi/vue'
import { base, immutableZkEvm, mantle } from 'viem/chains'
import { useAccount, useDisconnect } from 'use-wagmi'
import type { DisconnectMutateAsync } from 'use-wagmi/query'

export const buildWagmiConfig = () => {
  const metadata = {
    name: 'KodaDot',
    description: 'KodaDot - Generative Art Marketplace',
    url: 'https://kodadot.xyz/',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
  }

  const chains = [base, immutableZkEvm, mantle]

  return defaultWagmiConfig({
    chains,
    projectId: useRuntimeConfig().public.walletConnectProjectId,
    metadata,
  })
}

export default (
) => {
  const { $wagmiConfig: config } = useNuxtApp()

  const account = useAccount({
    config: config as any,
  })

  const disconnect = useNuxtApp().runWithContext(
    () => useDisconnect({ config: config as any }).disconnectAsync,
  ) as Promise<DisconnectMutateAsync>

  return {
    ...account,
    disconnect,
  }
}
