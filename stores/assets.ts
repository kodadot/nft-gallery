import { defineStore } from 'pinia'
import { AssetListQueryResponse } from '@/components/bsx/Asset/types'
import assetListQuery from '@/queries/subsquid/bsx/assetList.graphql'
import { chainAssetOf } from '@/utils/config/chain.config'
import { useApollo } from '@/utils/config/useApollo'
import { emptyObject } from '@kodadot1/minimark/utils'

// export type TokenState = ReturnType<typeof state>
export type TokenProperty = {
  id: string
  decimals: number
  symbol: string
}

type TokenMap = Record<string, TokenProperty>

export const useAssetsStore = defineStore('assets', {
  state: (): TokenMap => ({
    tokenMap: emptyObject<TokenProperty>(),
  }),
  getters: {
    getAssetList: (state) => state.tokenMap,
    getAssetById: (state) => (id: string) =>
      state.tokenMap[id] || { id, decimals: 12, symbol: 'Unit' },
  },
  actions: {
    setAssetList(payload) {
      this.tokenMap = Object.assign(this.tokenMap, payload)
    },
    async fetchAssetList() {
      const { $apollo } = useNuxtApp()
      const { urlPrefix } = usePrefix()
      const { assetList } = await useApollo<any, AssetListQueryResponse>(
        $apollo as any,
        urlPrefix.value,
        assetListQuery
      ).catch(() => ({
        assetList: [chainAssetOf(urlPrefix.value)],
      }))

      const tokenMap: TokenMap = Object.fromEntries(
        assetList.map(({ id, decimals, symbol }) => [
          id,
          { id, decimals, symbol },
        ])
      )
      this.setAssetList(tokenMap)
      return tokenMap
    },
  },
})
