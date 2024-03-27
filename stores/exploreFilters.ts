import { defineStore } from 'pinia'

interface State {
  // status
  listed: boolean
  owned: boolean
  artView: boolean
  moreThanItems: number
  // price
  min: number | undefined
  max: number | undefined
  collections: string[] | undefined
}

export const useExploreFiltersStore = defineStore('exploreFilters', {
  state: (): State => ({
    listed: false,
    owned: false,
    min: undefined,
    max: undefined,
    artView: false,
    collections: undefined,
    moreThanItems: 0,
  }),
  getters: {
    getStatusFilters: (state) => ({
      listed: state.listed,
      owned: state.owned,
      artView: state.artView,
      collections: state.collections?.toString(),
      moreThanItems: state.moreThanItems,
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
    setMoreThanItems(payload) {
      this.moreThanItems = payload
    },
  },
})
