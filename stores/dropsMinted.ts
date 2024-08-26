import { defineStore } from 'pinia'
import type { Drop } from '~/components/drops/useDrops'

export const useMintedDropsStore = defineStore('mintedDrops', {
  state: () => ({
    mintedDrops: [] as Drop[],
  }),
  getters: {
    sortedMintedDrops(): Drop[] {
      return [...this.mintedDrops].sort((a, b) => {
        // Sort from bigger to lower number
        return Number(b.collection.collection) - Number(a.collection.collection)
      })
    },
  },
  actions: {
    addMintedDrop(drop: Drop) {
      const exists = this.mintedDrops.some(d => d.collection.id === drop.collection.id)
      if (!exists) {
        this.mintedDrops.push(drop)
      }
    },
    clearMintedDrops() {
      this.mintedDrops = []
    },
  },
})
