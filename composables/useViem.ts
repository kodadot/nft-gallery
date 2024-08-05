import { createPublicClient, createWalletClient, custom, http } from 'viem'
import type { Prefix } from '@kodadot1/static'

export default function (prefix: Prefix) {
  const publicClient = createPublicClient({
    chain: PREFIX_TO_CHAIN[prefix],
    transport: http(),
  })

  const getWalletClient = () => {
    if (window.ethereum) {
      return createWalletClient({
        chain: PREFIX_TO_CHAIN[prefix],
        transport: custom(window.ethereum),
      })
    }
  }

  return {
    publicClient,
    getWalletClient,
  }
}
