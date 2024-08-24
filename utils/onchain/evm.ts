import { readContract } from '@wagmi/core'
import type { Prefix } from '@kodadot1/static'
import type { OnChainData } from './types'
import { GENSOL_ABI } from '@/composables/transaction/evm/utils'
import { getEvmCollection } from '@/services/ogi'

export const evmCollection = async (address: `0x${string}`, chain: Prefix) => {
  const { $wagmiConfig } = useNuxtApp()
  const [collectionSupply, collectionMetadata, getCollection] = await Promise.all([
    readContract($wagmiConfig, {
      address,
      abi: GENSOL_ABI,
      functionName: 'totalSupply',
    }),
    readContract($wagmiConfig, {
      address,
      abi: GENSOL_ABI,
      functionName: 'contractURI',
    }),

    // usually erc721 contract have minted function to get the minted count
    // 1. drops on opensea: https://etherscan.io/token/0xc5d914aea6f463f8e3f2797b4e258904c82cedad
    // use totalSupply to get the minted count. maxSupply also exists
    // 2. drops on fxhash: https://basescan.org/token/0xAC2D45854EAFF6eF61c2d5c8c7224Ea255937a9C
    // also use totalSupply to get the minted count. maxSupply = totalSupply + remainingSupply

    // at the moment use api from ogi is because our contract doesn't have the minted function
    getEvmCollection(chain, address),
  ]) as [bigint, string, { claimed?: string }]

  let metadata: OnChainData = { description: '', name: '', image: '', generative_uri: '', banner: '' }
  if (collectionMetadata) {
    metadata = await $fetch(sanitizeIpfsUrl(collectionMetadata))
  }

  const maxSupply = Number(collectionSupply.toString())
  const minted = Number(getCollection?.claimed) || 0

  return {
    maxSupply,
    minted,
    metadata,
  }
}
