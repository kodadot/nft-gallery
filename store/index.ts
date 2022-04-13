import type { ApiPromise } from '@polkadot/api'
import Connector from '@kodadot1/sub-api'
import correctFormat from '@/utils/ss58Format'
import { GetterTree, MutationTree, Store } from 'vuex'

type VuexAction = {
  type: string
  payload: string
}

const apiPlugin = (store: Store<any>): void => {
  const { getInstance: Api } = Connector

  Api().on('connect', async (api: ApiPromise) => {
    store.commit('setApiConnected', true)
    const { chainSS58, chainDecimals, chainTokens } = api.registry
    const { genesisHash } = api
    console.log('[API] Connect to <3', store.state.setting.apiUrl, {
      chainSS58,
      chainDecimals,
      chainTokens,
      genesisHash,
    })
    store.dispatch('chain/setChainProperties', {
      ss58Format: correctFormat(chainSS58),
      tokenDecimals: chainDecimals[0] || 12,
      tokenSymbol: chainTokens[0] || 'Unit',
      genesisHash: genesisHash || '',
    })

    const nodeInfo = store.getters.availableNodes
      .filter((o: any) => o.value === store.state.setting.apiUrl)
      .map((o: any) => {
        return o.info
      })[0]
    store.dispatch('explorer/setExplorer', { chain: nodeInfo })
  })
  Api().on('error', async (error: Error) => {
    store.commit('setError', error)
    console.warn('[API] error', error)
    // Api().disconnect()
  })
  Api().on('disconnected', () => {
    store.commit('setApiConnected', false)
    console.log('[API] disconnected')
  })
}

const myPlugin = (store: Store<null>): void => {
  const { getInstance: Api } = Connector

  store.subscribeAction(({ type, payload }: VuexAction) => {
    if (type === 'setApiUrl' && payload) {
      store.commit('setLoading', true)
      Api().connect(payload)
    }
  })
}

export const state = () => ({
  loading: false,
  keyringLoaded: false,
  chainProperties: {},
  development: {},
  error: null,
  isApiConnected: false,
})

export type IndexState = ReturnType<typeof state>

export const mutations: MutationTree<IndexState> = {
  keyringLoaded(state: any): void {
    state.keyringLoaded = true
  },
  setDevelopment(state: any, data: any): void {
    state.development = Object.assign(state.development, data)
  },
  setLoading(state: any, toggleTo: boolean): void {
    state.loading = toggleTo
  },
  setApiConnected(state, toggleTo: boolean): void {
    state.isApiConnected = toggleTo
  },
  setError(state: any, error: Error): void {
    state.loading = false
    state.error = error.message
    state.isApiConnected = false
  },
}

export const actions = {}

export const getters: GetterTree<IndexState, IndexState> = {
  getApiConnected(state: IndexState): boolean {
    return state.isApiConnected
  },
}

export const plugins = [apiPlugin, myPlugin]
