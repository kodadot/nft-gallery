import { createWeb3Modal } from '@web3modal/wagmi/vue'
import type { Web3Modal } from '@web3modal/wagmi'
import { useConfig } from '@wagmi/vue'

const modal = ref<Web3Modal>()

export default () => {
  const { urlPrefix } = usePrefix()
  const wagmiConfig = useConfig()

  if (!modal.value) {
    modal.value = createWeb3Modal({
      wagmiConfig,
      projectId: useRuntimeConfig().public.walletConnectProjectId,
      defaultChain: PREFIX_TO_CHAIN[urlPrefix.value],
    })
  }

  return {
    modal,
  }
}
