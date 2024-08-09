import { createWeb3Modal } from '@web3modal/wagmi/vue'
import type { Web3Modal } from '@web3modal/wagmi'

const modal = ref<Web3Modal>()

export default () => {
  const { urlPrefix } = usePrefix()
  const { $wagmiConfig } = useNuxtApp()

  if (!modal.value) {
    modal.value = createWeb3Modal({
      wagmiConfig: $wagmiConfig as any,
      projectId: useRuntimeConfig().public.walletConnectProjectId,
      defaultChain: PREFIX_TO_CHAIN[urlPrefix.value],
    })
  }

  return {
    modal,
  }
}
