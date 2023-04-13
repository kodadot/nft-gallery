import { AssetListQueryResponse } from '@/components/bsx/Asset/types'
import assetListQuery from '@/queries/subsquid/bsx/assetList.graphql'
import { chainAssetOf } from '@/utils/config/chain.config'
import { useApollo } from '@/utils/config/useApollo'
import { emptyObject } from '@kodadot1/minimark/utils'
import { ActionTree, Commit, GetterTree, MutationTree } from 'vuex'

export type TokenProperty = {
  id: string
  decimals: number
  symbol: string
}

type TokenMap = Record<string, TokenProperty>

const defaultState = {
  tokenMap: emptyObject<TokenMap>(),
}

export const state = () => defaultState

export type TokenState = ReturnType<typeof state>

export const mutations: MutationTree<TokenState> = {
  SET_ASSET_LIST(state: TokenState, data: TokenMap) {
    state.tokenMap = Object.assign({}, data)
  },
}

export const actions: ActionTree<TokenState, TokenState> = {
  async fetchAssetList(
    { commit }: { commit: Commit; state: TokenState },
    prefix: string
  ) {
    const client = this.app.apolloProvider.clients[prefix]
    const { assetList } = await useApollo<any, AssetListQueryResponse>(
      client,
      prefix,
      assetListQuery
    ).catch(() => ({
      assetList: [chainAssetOf(prefix)],
    }))

    const tokenMap: TokenMap = Object.fromEntries(
      assetList.map(({ id, decimals, symbol }) => [
        id,
        { id, decimals, symbol },
      ])
    )
    commit('SET_ASSET_LIST', tokenMap)
    return tokenMap
  },
}

export const getters: GetterTree<TokenState, TokenState> = {
  getAssetList: ({ tokenMap }: TokenState): TokenMap => tokenMap,
  getAssetById:
    ({ tokenMap }: TokenState) =>
    (id: string): TokenProperty =>
      tokenMap[id] || { id, decimals: 12, symbol: 'Unit' },
}
