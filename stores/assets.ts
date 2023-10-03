import { defineStore } from 'pinia'
import assetListQuery from '@/queries/subsquid/bsx/assetList.graphql'
import { chainAssetOf } from '@/utils/config/chain.config'
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
        ])
      )
    },
    setLocalPrefix(payload: Prefix) {
      this.localPrefix = payload
    },
    async fetchAssetList() {
      const { urlPrefix } = usePrefix()
      if (this.localPrefix === urlPrefix.value) {
        return
      }
      this.setLocalPrefix(urlPrefix.value)
      const { data: assetList } = await useAsyncQuery(assetListQuery, {})

      // if (error) {
      //   assetList.value = [chainAssetOf(urlPrefix.value)]
      // }

      this.setAssetList(assetList)
    },
  },
})
