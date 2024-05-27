import {
  createWeb3Modal,
  defaultWagmiConfig,
  useWeb3Modal,
} from '@web3modal/wagmi/vue'
import { base, mainnet, zkSync } from 'viem/chains'
import { reconnect } from '@wagmi/core'
import { useAccount, useDisconnect } from 'use-wagmi'

const projectId = useRuntimeConfig().public.walletConnectProjectId

const buildWagmiConfig = () => {
  const metadata = {
    name: 'KodaDot',
    description: 'KodaDot - Generative Art Marketplace',
    url: 'https://kodadot.xyz/',
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
  }

  const chains = [mainnet, base, zkSync]

  return defaultWagmiConfig({
    chains,
    projectId,
    metadata,
  })
}

const modal = ref()
const config = ref(buildWagmiConfig() as any)

export default () => {
  reconnect(config.value)

  createWeb3Modal({
    wagmiConfig: config.value,
    projectId,
  })

  if (!modal.value) {
    modal.value = useWeb3Modal()
  }

  const { isConnected, address } = useAccount({ config })
  const { disconnect } = useDisconnect({ config })

  const openModal = () => {
    modal.value.open()
  }

  return {
    openModal,
    isConnected,
    address,
    disconnect,
    config,
  }
}