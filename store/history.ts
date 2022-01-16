import { GetterTree, ActionTree, MutationTree, Commit } from 'vuex'
import { isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns'

export interface HistoryItem {
  id: string
  title: string
  image: string
  collection: string
  date: Date
}

export interface GalleryItem extends HistoryItem {
  author: string
  description: string
  price: number
  mimeType: string
}

export interface Collectionitem {
  name: string
  image: string
  description: string
  numberOfItems: number
}

export const state = () => ({
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
})

export type HistoryState = ReturnType<typeof state>

export const getters: GetterTree<HistoryState, HistoryState> = {
  getVisitedToday: ({ visitedNFTs }: any) =>
    visitedNFTs.filter((nft) => isToday(new Date(nft.date))),
  getVisitedYesterday: ({ visitedNFTs }: any) =>
    visitedNFTs.filter((nft) => isYesterday(new Date(nft.date))),
  getVisitedPastWeek: ({ visitedNFTs }: any) =>
    visitedNFTs.filter(
      (nft) =>
        isThisWeek(new Date(nft.date)) &&
        !isToday(new Date(nft.date)) &&
        !isYesterday(new Date(nft.date))
    ),
  getVisitedPastMonth: ({ visitedNFTs }: any) =>
    visitedNFTs.filter(
      (nft) =>
        isThisMonth(new Date(nft.date)) && !isThisWeek(new Date(nft.date))
    ),
  getVisitedEarlier: ({ visitedNFTs }: any) =>
    visitedNFTs.filter((nft) => !isThisMonth(new Date(nft.date))),
  getCurrentlyViewedItem: ({ currentlyViewedItem }) => currentlyViewedItem,
  getCurrentlyViewedCollection: ({ currentlyViewedCollection }) =>
    currentlyViewedCollection,
}

export const mutations: MutationTree<HistoryState> = {
  UPDATE_HISTORY_ITEM(state: any, data: HistoryItem | string) {
    if (typeof data === 'string') {
      state.visitedNFTs = state.visitedNFTs.filter((item) => item.id !== data)
    } else {
      // check if nft was visited before -> in that case delete it from history first
      if (state.visitedNFTs.find((item) => item.id === data.id)) {
        state.visitedNFTs = state.visitedNFTs.filter(
          (item) => item.id !== data.id
        )
      }
      // save a maximum of 30 items
      if (state.visitedNFTs.length === 30) {
        state.visitedNFTs.pop()
      }
      state.visitedNFTs.unshift(data)
    }
  },
  UPDATE_CURRENTLY_VIEWED_ITEM(state: any, data: GalleryItem) {
    state.currentlyViewedItem = data
  },
  UPDATE_CURRENTLY_VIEWED_COLLECTION(state: any, data: Collectionitem) {
    state.currentlyViewedCollection = data
  },
  UPDATE_CURRENT_COLLECTION(
    state: any,
    data: { id: string; nftIds: string[] }
  ) {
    state.currentCollection = data
  },
}

export const actions: ActionTree<HistoryState, HistoryState> = {
  addHistoryItem({ commit }: { commit: Commit }, data: HistoryItem) {
    commit('UPDATE_CURRENTLY_VIEWED_ITEM', data)
    const { id, title, image, collection, date } = data
    const historyItem = { id, title, image, collection, date }
    commit('UPDATE_HISTORY_ITEM', historyItem)
  },
  setCurrentlyViewedCollection(
    { commit }: { commit: Commit },
    data: Collectionitem
  ) {
    commit('UPDATE_CURRENTLY_VIEWED_COLLECTION', data)
  },
  removeHistoryItem({ commit }: { commit: Commit }, data: string) {
    commit('UPDATE_HISTORY_ITEM', data)
  },
  setCurrentCollection(
    { commit }: { commit: Commit },
    data: { id: string; nftIds: string[] }
  ) {
    commit('UPDATE_CURRENT_COLLECTION', data)
  },
}
