import { isThisMonth, isThisWeek, isToday, isYesterday } from 'date-fns'
import { defineStore } from 'pinia'

export interface HistoryItem {
  id: string
  title: string
  image: string
  collection: string
  date: Date
  prefix: string
}

interface State {
  visitedNFTs: HistoryItem[]
  currentlyViewedItem: {
    id: string
    title: string
    image: string
    collection: string
    date: Date
    author: string
    description: string
    price: number
    mimeType: string
  }
  currentlyViewedCollection: {
    name: string
    image: string
    description: string
    numberOfItems: number
  }
  currentCollection: {
    id: string
    nftIds: []
  }
}

export const useHistoryStore = defineStore('history', {
  state: (): State => ({
    visitedNFTs: [],
    currentlyViewedItem: {
      id: '',
      title: '',
      image: '',
      collection: '',
      date: new Date(),
      author: '',
      description: '',
      price: 0,
      mimeType: '',
    },
    currentlyViewedCollection: {
      name: '',
      image: '',
      description: '',
      numberOfItems: 0,
    },
    currentCollection: {
      id: '',
      nftIds: [],
    },
  }),
  getters: {
    getVisitedToday: (state) =>
      state.visitedNFTs.filter((nft) => isToday(new Date(nft.date))),
    getVisitedYesterday: (state) =>
      state.visitedNFTs.filter((nft) => isYesterday(new Date(nft.date))),
    getVisitedPastWeek: (state) =>
      state.visitedNFTs.filter(
        (nft) =>
          isThisWeek(new Date(nft.date)) &&
          !isToday(new Date(nft.date)) &&
          !isYesterday(new Date(nft.date))
      ),
    getVisitedPastMonth: (state) =>
      state.visitedNFTs.filter(
        (nft) =>
          isThisMonth(new Date(nft.date)) &&
          !isThisWeek(new Date(nft.date)) &&
          !isToday(new Date(nft.date)) &&
          !isYesterday(new Date(nft.date))
      ),
    getVisitedEarlier: (state) =>
      state.visitedNFTs.filter(
        (nft) =>
          !isThisMonth(new Date(nft.date)) &&
          !isToday(new Date(nft.date)) &&
          !isYesterday(new Date(nft.date))
      ),
    getCurrentlyViewedItem: (state) => state.currentlyViewedItem,
    getCurrentlyViewedCollection: (state) => state.currentlyViewedCollection,
  },
  actions: {
    addHistoryItem(payload) {
      this.currentlyViewedItem = payload
      const { id, title, image, collection, date, prefix } = payload
      const historyItem = { id, title, image, collection, date, prefix }

      if (typeof historyItem === 'string') {
        this.visitedNFTs = this.visitedNFTs.filter(
          (item) => item.id !== historyItem
        )
      } else {
        // check if nft was visited before -> in that case delete it from history first
        if (this.visitedNFTs.find((item) => item.id === historyItem.id)) {
          this.visitedNFTs = this.visitedNFTs.filter(
            (item) => item.id !== historyItem.id
          )
        }
        // save a maximum of 30 items
        if (this.visitedNFTs.length > 30) {
          this.visitedNFTs.pop()
        }
        this.visitedNFTs.unshift(historyItem)
      }

      localStorage.setItem(
        'history',
        JSON.stringify({ history: { visitedNFTs: this.visitedNFTs } })
      )
    },
    setCurrentlyViewedCollection(payload) {
      this.currentlyViewedCollection = payload
    },
    setCurrentCollection(payload) {
      this.currentCollection = payload
    },
  },
})
