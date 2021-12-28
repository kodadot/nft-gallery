import { GetterTree, ActionTree, MutationTree, Commit } from 'vuex'

export const state = (): {
  layoutClass: string;
  advancedUI: boolean;
  theatreView: string;
  compactGalleryItem: boolean;
  compactCollection: boolean;
  galleryItemsPerPage: number;
  collectionsPerPage: number;
  replaceBuyNowWithYolo: boolean
}  => ({
  layoutClass: 'is-one-third-desktop is-one-third-tablet',
  advancedUI: false,
  theatreView: 'default',
  compactGalleryItem: false,
  compactCollection: false,
  galleryItemsPerPage: 12,
  collectionsPerPage: 9,
  replaceBuyNowWithYolo: false,
})

export type PreferencesState = ReturnType<typeof state>

export const getters: GetterTree<PreferencesState, PreferencesState> = {
  getLayoutClass: ({ layoutClass }) => layoutClass,
  getTheatreView: ({ theatreView }) => theatreView,
  getCompactCollection: ({ compactCollection }) => compactCollection,
  getGalleryItemsPerPage: ({ galleryItemsPerPage }) => galleryItemsPerPage,
  getCollectionsPerPage: ({ collectionsPerPage }) => collectionsPerPage,
  getReplaceBuyNowWithYolo: ({ replaceBuyNowWithYolo }) => replaceBuyNowWithYolo,
}

export const mutations: MutationTree<PreferencesState> = {
  SET_LAYOUT_CLASS(state: PreferencesState, data) {
    state.layoutClass = data
  },
  SET_ADVANCED_UI(state: PreferencesState, data) {
    // if set to false reset state back to default
    if(!data) {
      state.layoutClass = 'is-one-third-desktop is-one-third-tablet',
      state.theatreView = 'default'
      state.compactGalleryItem = false
      state.compactCollection = false
      state.galleryItemsPerPage = 12
      state.collectionsPerPage = 9
    }
    state.advancedUI = data
  },
  SET_THEATRE_VIEW(state: PreferencesState, data) {
    state.theatreView = data ? 'theatre' : 'default'
  },
  SET_COMPACT_GALLERY_ITEM(state: PreferencesState, data) {
    state.compactGalleryItem = data
  },
  SET_COMPACT_COLLECTION(state: PreferencesState, data) {
    state.compactCollection = data
  },
  REPLACE_BUYNOW_WITH_YOLO(state: PreferencesState, data) {
    state.replaceBuyNowWithYolo = data
  },
  SET_GALLERY_ITEMS_PER_PAGE(state: PreferencesState, data) {
    state.galleryItemsPerPage = data
  },
  SET_COLLECTIONS_PER_PAGE(state: PreferencesState, data) {
    state.collectionsPerPage = data
  },
}

export const actions: ActionTree<PreferencesState, PreferencesState> = {
  setLayoutClass({ commit }: { commit: Commit }, data) {
    commit('SET_LAYOUT_CLASS', data)
  },
  setAdvancedUI({ commit }: { commit: Commit }, data) {
    commit('SET_ADVANCED_UI', data)
  },
  setTheatreView({ commit }: { commit: Commit }, data) {
    commit('SET_THEATRE_VIEW', data)
  },
  setCompactGalleryItem({ commit }: { commit: Commit }, data) {
    commit('SET_COMPACT_GALLERY_ITEM', data)
  },
  setCompactCollection({ commit }: { commit: Commit }, data) {
    commit('SET_COMPACT_COLLECTION', data)
  },
  setGalleryItemsPerPage({ commit }: { commit: Commit }, data) {
    commit('SET_GALLERY_ITEMS_PER_PAGE', data)
  },
  setCollectionsPerPage({ commit }: { commit: Commit }, data) {
    commit('SET_COLLECTIONS_PER_PAGE', data)
  },
  setReplaceBuyNowWithYolo({ commit }: { commit: Commit }, data) {
    commit('REPLACE_BUYNOW_WITH_YOLO', data)
  },
}
