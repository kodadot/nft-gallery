import { AssetListQueryResponse } from '@/components/bsx/Asset/types'
import assetListByIdList from '@/queries/subsquid/bsx/assetListByIdList.graphql'
import { chainAssetOf } from '@/utils/config/chain.config'
import { useApollo } from '@/utils/config/useApollo'
import { emptyObject, isEmpty } from '@kodadot1/minimark'
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
  SET_ASSET_LIST(state: TokenState, data: any) {
    state.tokenMap = Object.assign({}, data)
  },
}

export const actions: ActionTree<TokenState, TokenState> = {
  async fetchAssetList(
    { commit, state }: { commit: Commit; state: TokenState },
    prefix: string
  ) {
    if (!isEmpty(state.tokenMap)) {
      return state.tokenMap
    }

    const client = this.app.apolloProvider.clients[prefix]
    const { assetList } = await useApollo<any, AssetListQueryResponse>(
      client,
      prefix,
      assetListByIdList
    ).catch(() => ({
      assetList: [chainAssetOf(prefix)],
    }))

    const tokenMap = Object.fromEntries(
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
