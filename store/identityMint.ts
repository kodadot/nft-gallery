import { ActionTree, Commit, GetterTree, MutationTree } from 'vuex'

const defaultState: IdentityMintStruct = {
  identities: {},
}

export const state = () => defaultState

export type State = ReturnType<typeof state>

export const getters: GetterTree<State, State> = {
  getIdentityMintFor(
    state: IdentityMintStruct
  ): (address: string) => MintInfo | undefined {
    return (address: string) => state.identities[address]
  },
}

export const mutations: MutationTree<State> = {
  addIdentity(
    state: IdentityMintStruct,
    identityMintRequest: IdentityMintRequest
  ): void {
    const { address, cacheData } = identityMintRequest
    state.identities[address] = cacheData
  },
}

export const actions: ActionTree<State, State> = {
  setIdentity(
    { commit }: { commit: Commit },
    identityMintRequest: IdentityMintRequest
  ): void {
    commit('addIdentity', identityMintRequest)
  },
}

export interface MintInfo {
  totalCreated: number
  totalCollected: number
  totalSold: number
  firstMintDate: Date
  updatedAt: Date
  lastBoughtDate: Date
}

export interface IdentityMintMap {
  [address: string]: MintInfo
}

export interface IdentityMintStruct {
  identities: IdentityMintMap
}

export interface IdentityMintRequest {
  address: string
  cacheData: MintInfo
}
