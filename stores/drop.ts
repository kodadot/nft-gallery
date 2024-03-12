import { defineStore } from 'pinia'
import { DropItem } from '@/params/types'
import { DropMintedNft } from '@/composables/drop/useGenerativeDropMint'
import { MassMintNFT } from '@/composables/drop/massmint/useDropMassMint'
import { GenerativePreviewItem } from '@/composables/drop/useGenerativePreview'
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
  isCaptutingImage: boolean
  selectedImage: string
  runtimeMintCount: number
  drop: DropItem
  mintedDropCount: number
  claimedNFT: DropMintedNft | undefined
  mintedNFT: NFTWithMetadata | undefined
  // massmint
  amountToMint: number
  toMintNFTs: MassMintNFT[]
  previewItem: GenerativePreviewItem | undefined
  mintingSession: MintingSession
  allocatedNFTs: AllocatedNFT[]
}

export const useDropStore = defineStore('drop', {
  state: (): State => {
    const { urlPrefix } = usePrefix()
    return {
      loading: false,
      walletConnecting: false,
      isCaptutingImage: false,
      selectedImage: '',
      runtimeMintCount: 0,
      drop: { ...DEFAULT_DROP, chain: urlPrefix.value },
      mintedDropCount: 0,
      claimedNFT: undefined,
      mintedNFT: undefined,
      amountToMint: 1,
      toMintNFTs: [],
      previewItem: undefined,
      mintingSession: { txHash: '', items: [] },
      allocatedNFTs: [],
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
    setIsCaptutingImage(payload: boolean) {
      this.isCaptutingImage = payload
    },
    setPreviewItem(payload: GenerativePreviewItem | undefined) {
      this.previewItem = payload
    },
    setMintingSession(payload: MintingSession) {
      this.mintingSession = payload
    },
    setToMintNFTs(payload: MassMintNFT[]) {
      this.toMintNFTs = payload
    },
    setAllocatedNFTs(payload: AllocatedNFT[]) {
      this.allocatedNFTs = payload
    },
    setAmountToMint(payload: number) {
      this.amountToMint = payload
    },
    setSelectedImage(payload: string) {
      this.selectedImage = payload
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
      this.mintedDropCount = payload
    },
    setClaimedNFT(payload: DropMintedNft | undefined) {
      this.claimedNFT = payload
    },
    setMintedNFT(payload: NFTWithMetadata | undefined) {
      this.mintedNFT = payload
    },
  },
})
