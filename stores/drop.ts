import { defineStore } from 'pinia'
import { DropItem } from '@/params/types'
import { DropMintedNft } from '@/composables/drop/useGenerativeDropMint'

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
  mintsCount: number
  claimedNFT: DropMintedNft | undefined
  mintedNFT: NFTWithMetadata | undefined
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
      mintsCount: 0,
      claimedNFT: undefined,
      mintedNFT: undefined,
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
      this.mintsCount = payload
    },
    setClaimedNFT(payload: DropMintedNft | undefined) {
      this.claimedNFT = payload
    },
    setMintedNFT(payload: NFTWithMetadata | undefined) {
      this.mintedNFT = payload
    },
    reset() {
      const { urlPrefix } = usePrefix()
      this.loading = false
      this.walletConnecting = false
      this.isCaptutingImage = false
      this.selectedImage = ''
      this.runtimeMintCount = 0
      this.drop = { ...DEFAULT_DROP, chain: urlPrefix.value }
      this.mintsCount = 0
      this.claimedNFT = undefined
      this.mintedNFT = undefined
    },
  },
})
