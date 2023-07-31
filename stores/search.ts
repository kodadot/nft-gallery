import { defineStore } from 'pinia'

interface State {
  isCollectionSearch: boolean
}

export const useSearchStore = defineStore('search', {
  state: (): State => ({
    isCollectionSearch: true,
  }),
  getters: {
    isCollectionSearchMode: (state) => state.isCollectionSearch,
  },
  actions: {
    setCollectionSearchMode(payload) {
      this.isCollectionSearch = payload
    },
  },
})
