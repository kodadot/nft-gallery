import { defineStore } from 'pinia'

interface State {
  // status
  listed: boolean
  owned: boolean
  issuer: string
  soldByCreator: boolean
  artView: boolean
  // price
  min: number | undefined
  max: number | undefined
  collections: string[] | undefined
}

export const useExploreFiltersStore = defineStore('exploreFilters', {
  state: (): State => ({
    listed: false,
    owned: false,
    issuer: '',
    soldByCreator: false,
    min: undefined,
    max: undefined,
    artView: false,
    collections: undefined,
  }),
  getters: {
    getStatusFilters: (state) => ({
      listed: state.listed,
      owned: state.owned,
      issuer: state.issuer,
      soldByCreator: state.soldByCreator,
      artView: state.artView,
      collections: state.collections?.toString(),
    }),
    getPriceRange: (state) => ({ min: state.min, max: state.max }),
  },
  actions: {
    setListed(payload) {
      this.listed = payload
    },
    setOwned(payload) {
      this.owned = payload
    },
    setIssuer(payload) {
      this.issuer = payload
    },
    setSoldByCreator(payload) {
      this.soldByCreator = payload
    },
    setArtView(payload) {
      this.artView = payload
    },
    setMin(payload) {
      this.min = payload
    },
    setMax(payload) {
      this.max = payload
    },
    setPriceRange(payload) {
      this.min = payload.min
      this.max = payload.max
    },
    setCollections(payload) {
      this.collections = payload
    },
  },
})
