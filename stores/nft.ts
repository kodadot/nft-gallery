import { defineStore } from 'pinia'
import type { NFTMetadata } from '@/services/oda'
import type { NFT } from '@/types'
import type { Abi } from '@/composables/transaction/types'

export const useNftStore = defineStore('nft', {
  state: () => ({
    // data from indexer
    nft: undefined as NFT | undefined,

    // data from oda-worker
    nftMetadata: undefined as NFTMetadata | undefined,
    nftImage: '',
    nftMimeType: '',
    nftAnimation: '',
    nftAnimationMimeType: '',
    abi: null as Abi | null,
  }),

  getters: {
    getNft: state => state.nft,
    getNftMetadata: state => state.nftMetadata,
    getNftImage: state => state.nftImage,
    getNftMimeType: state => state.nftMimeType,
    getNftAnimation: state => state.nftAnimation,
    getNftAnimationMimeType: state => state.nftAnimationMimeType,
    getAbi: state => state.abi,
  },
})
