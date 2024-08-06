import { createPublicClient, createWalletClient, custom, http } from 'viem'
import type { Prefix } from '@kodadot1/static'

const provider = ref()

export default function (prefix: Prefix) {
  const walletStore = useWalletStore()

  const publicClient = createPublicClient({
    chain: PREFIX_TO_CHAIN[prefix],
    transport: http(),
  })

  const { connector } = useWagmi({ reconnect: Boolean(walletStore.selected && walletStore.getIsEvm) })

  watchEffect(async () => {
    if (connector.value?.getProvider) {
      provider.value = await connector.value.getProvider()
    }
  })

  const getWalletClient = () => {
    if (provider.value) {
      return createWalletClient({
        chain: PREFIX_TO_CHAIN[prefix],
        transport: custom(provider.value),
      })
    }
  }

  return {
    publicClient,
    getWalletClient,
  }
}
