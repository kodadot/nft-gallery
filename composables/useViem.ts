import { createPublicClient, createWalletClient, custom, http } from 'viem'
import type { Prefix } from '@kodadot1/static'

const provider = reactive<{ value: any, fetching: boolean }>({ value: undefined, fetching: false })

export default function (prefix: Prefix) {
  const { connector } = useWagmi()

  const publicClient = createPublicClient({
    chain: PREFIX_TO_CHAIN[prefix],
    transport: http(),
  })

  const getWalletClient = () => {
    if (provider.value) {
      return createWalletClient({
        chain: PREFIX_TO_CHAIN[prefix],
        transport: custom(provider.value),
      })
    }
  }

  watch(connector, async (connector) => {
    if (provider.fetching) {
      return
    }

    if (connector?.getProvider && !provider.value) {
      provider.fetching = true
      provider.value = await connector.getProvider()
      provider.fetching = false
      console.log('[VIEM::PROVIDER] Using', provider.value)
    }
    else if (!connector && provider.value) {
      provider.value = undefined
      console.log('[VIEM::PROVIDER] Cleared')
    }
  })

  return {
    publicClient,
    getWalletClient,
  }
}
