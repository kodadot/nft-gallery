import { createWeb3Modal, useWeb3Modal } from '@web3modal/wagmi/vue'

const modal = ref()

export default () => {
  const { config } = useWagmi()
  const { urlPrefix } = usePrefix()

  createWeb3Modal({
    wagmiConfig: config,
    projectId: useRuntimeConfig().public.walletConnectProjectId,
    defaultChain: PREFIX_TO_CHAIN[urlPrefix.value],
  })

  if (!modal.value) {
    modal.value = useWeb3Modal()
  }

  return {
    modal,
  }
}
