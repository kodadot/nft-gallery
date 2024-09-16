import { type Registration } from '@polkadot/types/interfaces/identity/types'
import { defineStore } from 'pinia'
import { type ChainVM, DEFAULT_VM_PREFIX, type Prefix, chainList } from '@kodadot1/static'
import { getChainId } from '@wagmi/core'
import { emptyObject } from '@/utils/empty'
import { networkToPrefix } from '@/composables/useMultipleBalance'
import { chainPropListOf, vmOf } from '@/utils/config/chain.config'

const DEFAULT_BALANCE_STATE = {
  ksm: '0',
  rmrk: '0',
  ahk: '0',
  dot: '0',
  ahp: '0',
  eth: '0',
  mnt: '0',
  // ahr: '0',
  // glmr: '0',
  // movr: '0',
}

export interface IdentityMap {
  [address: string]: Registration
}

type Key = Prefix | string | number
type BalanceMap<T extends Key = string> = Record<T, string>

export type ChainType =
  | 'polkadot'
  | 'kusama'
  | 'kusamaHub'
  | 'polkadotHub'
  | 'base'
  | 'immutablex'
  | 'mantle'
// | 'rococoHub'

type ChainDetail = {
  balance: string
  nativeBalance: string
  usd: string
  selected: boolean
  address: string
}
export type ChainToken = Partial<Record<'dot' | 'ksm' | 'eth' | 'mnt', ChainDetail>>

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
  balance?: BalanceMap<keyof ChainToken>
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
        1: '0',
        5: '0',
      },
      address: useWalletStore().selected?.address || '',
    },
    multiBalances: DEFAULT_MULTI_BALANCE_STATE,
    multiBalanceNetwork: 'main-network',
    multiBalanceAssets: [
      { chain: 'kusama' },
      { chain: 'kusamaHub' },
      { chain: 'polkadot', token: 'DOT' },
      { chain: 'polkadotHub', token: 'DOT' },
      { chain: 'base', token: 'ETH' },
      { chain: 'immutablex', token: 'ETH' },
      { chain: 'mantle', token: 'MNT' },
    ],
    multiBalanceAssetsTestnet: [
      // { chain: 'rococoHub', token: 'ROC' },
    ],
  }),
  getters: {
    availableIdentities: state => state.identities,
    getAuth: state => state.auth,
    getAuthAddress: state => state.auth.address,
    getIdentityFor: state => (address: string) => state.identities[address],
    getTokenBalanceOf: state => (tokenId: string) =>
      state.auth.tokens ? state.auth.tokens[tokenId] || '0' : '0',
    getAuthBalance: (state) => {
      const { urlPrefix } = usePrefix()
      return state.auth.balance
        ? state.auth.balance[urlPrefix.value] || '0'
        : '0'
    },
    getTotalUsd: (state) => {
      if (
        state.multiBalances
        && Object.values(state.multiBalances?.chains || 0).length > 0
      ) {
        return Object.values(state.multiBalances.chains)
          .flatMap(chain => Object.values(chain))
          .reduce((total, token) => total + parseFloat(token.usd), 0)
      }

      return 0
    },
    getWalletVmAssets: (): any[] => {
      const { getWalletVM } = storeToRefs(useWalletStore())
      return getWalletVM.value ? getVmAssets(getWalletVM.value) : []
    },
    getWalletVmChains(): string[] {
      return this.getWalletVmAssets.map(asset => asset.chain)
    },
    getStatusMultiBalances(state): string {
      let loadedAssets = 0
      for (const key in state.multiBalances.chains) {
        if (
          Object.prototype.hasOwnProperty.call(state.multiBalances.chains, key)
        ) {
          loadedAssets += Object.keys(state.multiBalances.chains[key]).length
        }
      }
      return loadedAssets < this.getWalletVmAssets.length ? 'loading' : 'done'
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
    },
    setBalance(prefix: string, balance: string) {
      if (this.auth.balance) {
        this.auth.balance[prefix] = balance
      }
    },
    setPrefixBalance(balance: string, prefix: Prefix) {
      if (this.auth.balance) {
        this.auth.balance[prefix] = balance
      }
    },
    setTokenListBalance(request: BalanceMap) {
      this.auth.tokens = request
    },
    async fetchBalance({ address }: { address: string }) {
      const { fetchBalance } = useBalance()
      const { getWalletVM } = useWalletStore()
      const { vm } = useChain()

      if (!getWalletVM) {
        return
      }

      let prefix = usePrefix().urlPrefix.value

      // remove once multiwallet support is added
      if (vm.value !== getWalletVM) {
        execByVm({
          EVM: () => {
            const { $wagmiConfig } = useNuxtApp()
            const chainId = getChainId($wagmiConfig)
            prefix = CHAIN_ID_TO_PREFIX[chainId] ?? ''
          },
          SUB: () => {
            prefix = DEFAULT_VM_PREFIX[getWalletVM]
            address = formatAddress(address, chainPropListOf(prefix).ss58Format)
          },
        }, { vm: getWalletVM })
      }

      const balance = await fetchBalance(address, prefix)

      if (balance) {
        this.setPrefixBalance(balance, prefix)
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

export const getVmAssets = (vm: ChainVM) => {
  const { isTestnet } = usePrefix()
  const { multiBalanceAssets, multiBalanceAssetsTestnet }
    = storeToRefs(useIdentityStore())

  // useChain().availableChainsByVm excludes disabled chains like dot
  const vmChains = chainList().filter(
    ({ value: prefix }) => vm === vmOf(prefix as Prefix),
  )

  const assets = isTestnet
    ? multiBalanceAssetsTestnet.value
    : multiBalanceAssets.value

  return assets.filter(asset =>
    vmChains
      .map(chain => chain.value)
      .includes(networkToPrefix[asset.chain] as ChainType),
  )
}
