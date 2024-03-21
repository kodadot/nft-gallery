import { defineStore } from 'pinia'
import { DropItem } from '@/params/types'
import { DropMintedNft } from '@/composables/drop/useGenerativeDropMint'
import { MassMintNFT } from '@/composables/drop/massmint/useDropMassMint'
import { MintingSession } from '@/components/collection/drop/types'
import { AllocatedNFT } from '@/services/fxart'

const DEFAULT_DROP: Omit<DropItem, 'chain'> = {
  id: '',
  collection: '',
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
  claimedNFT: DropMintedNft | undefined
  previewItem: GenerativePreviewItem | undefined
  // massmint
  amountToMint: number
  toMintNFTs: MassMintNFT[] // used to render each NFT and track their data, after a successfully preview generation the metadata is uplaoded
  allocatedNFTs: AllocatedNFT[] // once all toMintNFTs have metadata they are allocated
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
      claimedNFT: undefined,
      amountToMint: 1,
      toMintNFTs: [],
      previewItem: undefined,
      mintingSession: { txHash: undefined, items: [] },
      allocatedNFTs: [],
      mintedNFTs: [],
    }
  },
  getters: {},
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
    setMintedDropCount(payload: number) {
      this.mintsCount = payload
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
      this.allocatedNFTs = []
    },
    resetMassmint() {
      this.loading = false
      this.toMintNFTs = []
      this.allocatedNFTs = []
      this.mintedNFTs = []
      this.mintingSession = { txHash: undefined, items: [] }
    },
  },
})
