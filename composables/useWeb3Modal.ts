import { createWeb3Modal, useWeb3Modal } from '@web3modal/wagmi/vue'

const modal = ref()

export default () => {
  const { config } = useWagmi()

  createWeb3Modal({
    wagmiConfig: config,
    projectId: useRuntimeConfig().public.walletConnectProjectId,
  })

  if (!modal.value) {
    modal.value = useWeb3Modal()
  }

  return {
    modal,
  }
}
