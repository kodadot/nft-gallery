import { balanceOf } from '@kodadot1/sub-api'
import { Registration } from '@polkadot/types/interfaces/identity/types'
import { defineStore } from 'pinia'
import consola from 'consola'
import { emptyObject } from '@/utils/empty'
import { formatAddress } from '@/utils/account'
import type { Prefix } from '@kodadot1/static'
import { getKusamaAssetId } from '@/utils/api/bsx/query'

const DEFAULT_BALANCE_STATE = {
  bsx: '0',
  ksm: '0',
  rmrk: '0',
  ahk: '0',
  dot: '0',
  ahp: '0',
  // ahr: '0',
  // glmr: '0',
  // movr: '0',
}

export interface IdentityMap {
  [address: string]: Registration
}

type Key = Prefix | string | number
type BalanceMap<T extends Key = string> = Record<T, string>
type ChangeAddressRequest = {
  address: string
  apiUrl?: string
}

export type ChainType =
  | 'polkadot'
  | 'kusama'
  | 'basilisk'
  | 'kusamaHub'
  | 'polkadotHub'
// | 'rococoHub'

type ChainDetail = {
  balance: string
  nativeBalance: string
  usd: string
  selected: boolean
  address: string
}
export type ChainToken = Partial<Record<'dot' | 'ksm' | 'bsx', ChainDetail>>

interface MultiBalances {
  address: string
  chains: Partial<Record<ChainType, ChainToken>>
}

const DEFAULT_MULTI_BALANCE_STATE: MultiBalances = {
  address: '',
  chains: {},
}

export interface Auth {
  address: string
  source?: 'keyring' | 'extension' | 'ledger'
  balance?: BalanceMap<Prefix>
  tokens?: BalanceMap<number> // <id, amount>
}

export interface IdentityStruct {
  identities: IdentityMap
  auth: Auth
  multiBalances: MultiBalances
  multiBalanceNetwork: 'main-network' | 'test-network'
  multiBalanceAssets: {
    chain: ChainType
    token?: string
    tokenId?: string
  }[]
  multiBalanceAssetsTestnet: {
    chain: ChainType
    token?: string
    tokenId?: string
  }[]
}

export interface IdenityRequest {
  address: string
  identity: Registration
}

export const useIdentityStore = defineStore('identity', {
  state: (): IdentityStruct => ({
    identities: emptyObject<IdentityMap>(),
    auth: {
      ...emptyObject<Auth>(),
      balance: DEFAULT_BALANCE_STATE,
      tokens: {
        '1': '0',
        '5': '0',
      },
      address: localStorage.getItem('kodaauth') || '',
    },
    multiBalances: DEFAULT_MULTI_BALANCE_STATE,
    multiBalanceNetwork: 'main-network',
    multiBalanceAssets: [
      { chain: 'kusama' },
      { chain: 'kusamaHub' },
      { chain: 'polkadot', token: 'DOT' },
      { chain: 'polkadotHub', token: 'DOT' },
      { chain: 'basilisk', token: 'BSX' },
      { chain: 'basilisk', token: 'KSM', tokenId: getKusamaAssetId('bsx') },
    ],
    multiBalanceAssetsTestnet: [
      // { chain: 'rococoHub', token: 'ROC' },
    ],
  }),
  getters: {
    availableIdentities: (state) => state.identities,
    getAuth: (state) => state.auth,
    getAuthAddress: (state) => state.auth.address,
    getIdentityFor: (state) => (address: string) => state.identities[address],
    getTokenBalanceOf: (state) => (tokenId: string) =>
      state.auth.tokens ? state.auth.tokens[tokenId] || '0' : '0',
    getAuthBalance: (state) => {
      const { urlPrefix } = usePrefix()
      return state.auth.balance
        ? state.auth.balance[urlPrefix.value] || '0'
        : '0'
    },
    getTotalUsd: (state) => {
      if (
        state.multiBalances &&
        Object.values(state.multiBalances?.chains || 0).length > 0
      ) {
        return Object.values(state.multiBalances.chains)
          .flatMap((chain) => Object.values(chain))
          .reduce((total, token) => total + parseFloat(token.usd), 0)
      }

      return 0
    },
    getStatusMultiBalances: (state) => {
      let totalAssets = 0
      for (const key in state.multiBalances.chains) {
        if (
          Object.prototype.hasOwnProperty.call(state.multiBalances.chains, key)
        ) {
          totalAssets += Object.keys(state.multiBalances.chains[key]).length
        }
      }

      const { isTestnet } = usePrefix()
      const assets = isTestnet
        ? state.multiBalanceAssetsTestnet
        : state.multiBalanceAssets

      return totalAssets < assets.length ? 'loading' : 'done'
    },
  },
  actions: {
    resetAuth() {
      this.auth = {
        ...emptyObject<Auth>(),
        balance: DEFAULT_BALANCE_STATE,
        tokens: emptyObject<BalanceMap>(),
      }
      this.resetMultipleBalances()
      localStorage.removeItem('kodaauth')
    },
    resetMultipleBalances() {
      this.multiBalances.address = ''
      this.multiBalances.chains = {}
    },
    setIdentity(identityRequest: IdenityRequest) {
      const { address, identity } = identityRequest
      if (!this.identities[address]) {
        this.identities[address] = identity
      }
    },
    async setAuth(authRequest: Auth) {
      this.auth = { ...authRequest, balance: DEFAULT_BALANCE_STATE }
      await this.fetchBalance({ address: authRequest.address })
      localStorage.setItem('kodaauth', authRequest.address || '')
    },
    setBalance(prefix: string, balance: string) {
      if (this.auth.balance) {
        this.auth.balance[prefix] = balance
      }
    },
    setPrefixBalance(balance: string) {
      const { urlPrefix } = usePrefix()
      if (this.auth.balance) {
        this.auth.balance[urlPrefix.value] = balance
      }
    },
    setTokenListBalance(request: BalanceMap) {
      this.auth.tokens = request
    },
    setCorrectAddressFormat(ss58Prefix: number) {
      if (this.auth.address) {
        const address = formatAddress(this.auth.address, ss58Prefix)
        this.auth.address = address
        localStorage.setItem('kodaauth', address)
      }
    },
    async setCorrectAddressBalance(apiUrl: string) {
      if (this.auth.address) {
        const address = this.auth.address
        await this.fetchBalance({ address, apiUrl })
      }
    },
    async fetchBalance({ address }: ChangeAddressRequest) {
      const { apiInstance } = useApi()
      try {
        const api = await apiInstance.value
        const balance = await balanceOf(api, address)
        if (balance) {
          this.setPrefixBalance(balance)
        }
      } catch (e) {
        consola.error('[FETCH BALANCE] Unable to get user balance', e)
      }
    },
    setMultiBalances({ address, chains, chainName }) {
      this.multiBalances = {
        ...this.multiBalances,
        address,
        chains: {
          ...this.multiBalances.chains,
          [chainName]: {
            ...this.multiBalances.chains[chainName],
            ...chains[chainName],
          },
        },
      }
    },
  },
})
