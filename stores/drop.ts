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
  runtimeMintCount: number
  drop: DropItem
  mintedDropCount: number
  claimedNFT: DropMintedNft | undefined
  // massmint
  amountToMint: number
  toMintNFTs: MassMintNFT[]
  previewItem: GenerativePreviewItem | undefined
  mintingSession: MintingSession
  allocatedNFTs: AllocatedNFT[]
  mintedNFTs: NFTWithMetadata[]
}

export const useDropStore = defineStore('drop', {
  state: (): State => {
    const { urlPrefix } = usePrefix()
    return {
      loading: false,
      walletConnecting: false,
      isCaptutingImage: false,
      runtimeMintCount: 0,
      drop: { ...DEFAULT_DROP, chain: urlPrefix.value },
      mintedDropCount: 0,
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
    setIsCaptutingImage(payload: boolean) {
      this.isCaptutingImage = payload
    },
    setPreviewItem(payload: GenerativePreviewItem | undefined) {
      this.previewItem = payload
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
  },
})
