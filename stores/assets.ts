import { defineStore } from 'pinia'
import type { Prefix } from '@kodadot1/static'

export type TokenProperty = {
  id: string
  decimals: number
  symbol: string
}

type TokenMap = Record<string, TokenProperty>

export const useAssetsStore = defineStore('assets', {
  state: (): { tokenMap: TokenMap; localPrefix: Prefix | null } => ({
    tokenMap: {},
    localPrefix: null,
  }),
  getters: {
    getAssetList: (state) => state.tokenMap,
    getAssetById: (state) => (id: string) =>
      state.tokenMap[id] || { id, decimals: 12, symbol: 'Unit' },
  },
  actions: {
    setAssetList(payload) {
      this.tokenMap = Object.fromEntries(
        toRaw(payload.value).assetList.map(({ id, decimals, symbol }) => [
          id,
          { id, decimals, symbol },
        ]),
      )
    },
    setLocalPrefix(payload: Prefix) {
      this.localPrefix = payload
    },
  },
})
