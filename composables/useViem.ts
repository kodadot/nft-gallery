import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { Prefix } from '@kodadot1/static'

export default function (prefix: Prefix) {
  const publicClient = createPublicClient({
    chain: PREFIX_TO_CHAIN[prefix],
    transport: http(),
  })

  const walletClient = createWalletClient({
    chain: PREFIX_TO_CHAIN[prefix],
    transport: custom(window.ethereum),
  })

  return {
    walletClient,
    publicClient,
  }
}
