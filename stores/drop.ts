import { defineStore } from 'pinia'
import { DropItem } from '~/params/types'

interface State {
  loading: boolean
  walletConnecting: boolean
  isCaptutingImage: boolean
  selectedImage: string
  runtimeMintCount: number
  drop: DropItem | null
}

export const useDropStore = defineStore('drop', {
  state: (): State => ({
    loading: false,
    walletConnecting: false,
    isCaptutingImage: false,
    selectedImage: '',
    runtimeMintCount: 0,
    drop: null,
  }),
  getters: {
    // loading: (state) => state.loading,
    // walletConnecting: (state) => state.walletConnecting,
    // isCaptutingImage: (state) => state.isCaptutingImage,
  },
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
    setDrop(payload: DropItem | null) {
      this.drop = payload
    },
  },
})
