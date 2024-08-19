import { defineStore } from 'pinia'
import type { DropItem } from '@/params/types'
import type { DropMintedNft } from '@/composables/drop/useGenerativeDropMint'
import type { MassMintNFT } from '@/composables/drop/massmint/useDropMassMint'
import type { MintingSession } from '@/components/collection/drop/types'

const DEFAULT_DROP: Omit<DropItem, 'chain'> = {
  id: '',
  collection: '',
  collectionName: '',
  collectionDescription: '',
  minted: 0,
  image: '',
  banner: '',
  name: '',
  content: '',
  alias: '',
  type: 'paid',
  meta: '',
  disabled: 0,
}
interface State {
  loading: boolean
  walletConnecting: boolean
  isCapturingImage: boolean
  runtimeMintCount: number
  drop: DropItem
  mintsCount: number
  userMintsCount: number
  claimedNFT: DropMintedNft | undefined
  previewItem: GenerativePreviewItem | undefined
  // massmint
  amountToMint: number
  toMintNFTs: MassMintNFT[] // used to render each NFT and track their data, after a successfully preview generation the metadata is uplaoded
  mintedNFTs: NFTWithMetadata[] // once all allocated NFTs are claimed, we retrieve 'NFTWithMetadata' to be able to list them
  mintingSession: MintingSession // used to show the final success modal with the minted NFTs and txHash if provided
}

export const useDropStore = defineStore('drop', {
  state: (): State => {
    const { urlPrefix } = usePrefix()
    return {
      loading: false,
      walletConnecting: false,
      isCapturingImage: false,
      runtimeMintCount: 0,
      drop: { ...DEFAULT_DROP, chain: urlPrefix.value },
      mintsCount: 0,
      userMintsCount: 0,
      claimedNFT: undefined,
      amountToMint: 1,
      toMintNFTs: [],
      previewItem: undefined,
      mintingSession: { txHash: undefined, items: [] },
      mintedNFTs: [],
    }
  },
  getters: {
    getIsLoadingMaxCount: (state) => {
      return !(state.drop.minted >= 0 && Boolean(state.drop.max))
    },
  },
  actions: {
    setLoading(payload: boolean) {
      this.loading = payload
    },
    setWalletConnecting(payload: boolean) {
      this.walletConnecting = payload
    },
    setIsCapturingImage(payload: boolean) {
      this.isCapturingImage = payload
    },
    setRuntimeMintCount(payload: number) {
      this.runtimeMintCount = payload
    },
    incrementRuntimeMintCount() {
      this.runtimeMintCount++
    },
    setDrop(payload: DropItem) {
      this.drop = payload
    },
    setClaimedNFT(payload: DropMintedNft | undefined) {
      this.claimedNFT = payload
    },
    reset() {
      const { urlPrefix } = usePrefix()
      this.loading = false
      this.walletConnecting = false
      this.isCapturingImage = false
      this.previewItem = undefined
      this.runtimeMintCount = 0
      this.drop = { ...DEFAULT_DROP, chain: urlPrefix.value }
      this.mintsCount = 0
      this.claimedNFT = undefined
      this.amountToMint = 1
      this.mintedNFTs = []
      this.toMintNFTs = []
      this.mintingSession = { txHash: undefined, items: [] }
    },
    resetMassmint() {
      this.loading = false
      this.toMintNFTs = []
      this.mintedNFTs = []
      this.mintingSession = { txHash: undefined, items: [] }
    },
  },
})
