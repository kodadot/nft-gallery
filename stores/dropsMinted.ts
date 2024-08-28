import { defineStore } from 'pinia'
import type { DropItem } from '@/params/types'

export const useMintedDropsStore = defineStore('mintedDrops', {
  state: () => ({
    mintedDrops: [] as DropItem[],
  }),
  getters: {
    sortedMintedDrops(): DropItem[] {
      return [...this.mintedDrops].sort((a, b) => {
        // Sort from bigger to lower number
        return Number(b.collection) - Number(a.collection)
      })
    },
  },
  actions: {
    addMintedDrop(drop: DropItem) {
      const exists = this.mintedDrops.some(d => d.collection === drop.collection)
      if (!exists) {
        this.mintedDrops.push(drop)
      }
    },
    clearMintedDrops() {
      this.mintedDrops = []
    },
  },
})
