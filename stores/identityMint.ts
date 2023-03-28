import { defineStore } from 'pinia'

export interface MintInfo {
  created: {
    totalCount: number
  }
  collected: {
    totalCount: number
  }
  sold: {
    totalCount: number
  }
  firstMintDate: Date
  updatedAt: number
  lastBoughtDate?: Date
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

interface State {
  identities: IdentityMintMap
}

export const useIdentityMintStore = defineStore('identityMint', {
  state: (): State => ({
    identities: {},
  }),
  getters: {
    // getIdentityMintFor: (state) => (address: string) => MintInfo | undefined {
    //   return (address: string) => state.identities[address]
    // },
  },
  actions: {
    getIdentityMintFor(address: string) {
      return this.identities[address]
    },
    setIdentity(identityMintRequest: IdentityMintRequest) {
      const { address, cacheData } = identityMintRequest
      this.identities[address] = cacheData
    },
  },
})
