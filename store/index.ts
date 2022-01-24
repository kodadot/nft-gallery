import type { ApiPromise } from '@polkadot/api'
import Connector from '@vue-polkadot/vue-api'
import correctFormat from '@/utils/ss58Format'
import { Store } from 'vuex'

type VuexAction = {
  type: string
  payload: string
}

const apiPlugin = (store: Store<any>): void => {
  const { getInstance: Api } = Connector

  Api().on('connect', async (api: ApiPromise) => {
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
}

const myPlugin = (store: Store<null>): void => {
  const { getInstance: Api } = Connector

  store.subscribeAction(({ type, payload }: VuexAction, _: any) => {
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
})
export const mutations = {
  keyringLoaded(state: any): void {
    state.keyringLoaded = true
  },
  setDevelopment(state: any, data: any): void {
    state.development = Object.assign(state.development, data)
  },
  setLoading(state: any, toggleTo: boolean): void {
    state.loading = toggleTo
  },
  setError(state: any, error: Error): void {
    state.loading = false
    state.error = error.message
  },
}

export const actions = {}

export const getters = {}

export const plugins = [apiPlugin, myPlugin]
