import { GetterTree, ActionTree, MutationTree, Commit } from 'vuex'

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
    const { address, data } = identityMintRequest
    if (!state.identities[address]) {
      state.identities[address] = data
    }
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
  firstMint: { nodes: any[] }
  nFTCollected: { totalCount: number }
  nFTCreated: { totalCount: number }
  nFTSold: { totalCount: number }
}

export interface IdentityMintMap {
  [address: string]: MintInfo
}

export interface IdentityMintStruct {
  identities: IdentityMintMap
}

export interface IdentityMintRequest {
  address: string
  data: MintInfo
}
