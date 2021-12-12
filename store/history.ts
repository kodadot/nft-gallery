import { GetterTree, ActionTree, MutationTree, Commit } from 'vuex'
import { isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns'

export interface HistoryItem {
    id: string,
    title: string,
    image: string,
    collection: string,
    date: Date
}

export const state = () => ({
    visitedNFTs: []
})

export type HistoryState = ReturnType<typeof state>

export const getters: GetterTree<HistoryState, HistoryState> = {
  getVisitedToday: ({ visitedNFTs }: any) => visitedNFTs.filter(nft => isToday(new Date(nft.date))),
  getVisitedYesterday: ({ visitedNFTs }: any) => visitedNFTs.filter(nft => isYesterday(new Date(nft.date))),
  getVisitedPastWeek: ({ visitedNFTs }: any) => visitedNFTs.filter(nft => isThisWeek(new Date(nft.date)) && !isToday(new Date(nft.date)) && !isYesterday(new Date(nft.date))),
  getVisitedPastMonth: ({ visitedNFTs }: any) => visitedNFTs.filter(nft => isThisMonth(new Date(nft.date)) && !isThisWeek(new Date(nft.date))),
  getVisitedEarlier: ({ visitedNFTs }: any) => visitedNFTs.filter(nft => !isThisMonth(new Date(nft.date)))
};

export const mutations: MutationTree<HistoryState> = {
  updateHistoryItems(state: any, data: HistoryItem | string) {
    if(typeof data === 'string') {
      state.visitedNFTs = state.visitedNFTs.filter(item => item.id !== data);
    }
    else {
      // check if nft was visited before -> in that case delete it from history first
      if(!!state.visitedNFTs.find(item => item.id === data.id)) {
        state.visitedNFTs = state.visitedNFTs.filter(item => item.id !== data.id);
      }
      // save a maximum of 30 items
      if(state.visitedNFTs.length === 30) {
        state.visitedNFTs.pop();
      }
      state.visitedNFTs.unshift(data);
    }
  }
};

export const actions: ActionTree<HistoryState, HistoryState> = {
  addHistoryItem({ commit }: { commit: Commit }, data: HistoryItem) {
    commit('updateHistoryItems', data);
  },
  removeHistoryItem({ commit }: { commit: Commit }, data: string) {
    commit('updateHistoryItems', data);
  },
};
