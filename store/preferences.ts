import { GetterTree, ActionTree, MutationTree, Commit } from 'vuex'

export const state = (): {
  // Interface
  layoutClass: string
  advancedUI: boolean
  theatreView: string
  compactGalleryItem: boolean
  compactCollection: boolean
  showPriceGallery: boolean
  galleryItemsPerPage: number
  collectionsPerPage: number
  replaceBuyNowWithYolo: boolean
  // Minting
  hasSupport: boolean
  hasCarbonOffset: boolean
  arweaveUpload: boolean
} => ({
  layoutClass: 'is-half-desktop is-half-tablet',
  advancedUI: false,
  theatreView: 'theatre',
  compactGalleryItem: true,
  compactCollection: false,
  showPriceGallery: false,
  galleryItemsPerPage: 12,
  collectionsPerPage: 9,
  replaceBuyNowWithYolo: false,
  hasSupport: true,
  hasCarbonOffset: true,
  arweaveUpload: false,
})

export type PreferencesState = ReturnType<typeof state>

export const getters: GetterTree<PreferencesState, PreferencesState> = {
  getLayoutClass: ({ layoutClass }) => layoutClass,
  getTheatreView: ({ theatreView }) => theatreView,
  getCompactCollection: ({ compactCollection }) => compactCollection,
  getShowPriceValue: ({ showPriceGallery }) => showPriceGallery,
  getGalleryItemsPerPage: ({ galleryItemsPerPage }) => galleryItemsPerPage,
  getCollectionsPerPage: ({ collectionsPerPage }) => collectionsPerPage,
  getReplaceBuyNowWithYolo: ({ replaceBuyNowWithYolo }) =>
    replaceBuyNowWithYolo,
  getHasSupport: ({ hasSupport }) => hasSupport,
  getHasCarbonOffset: ({ hasCarbonOffset }) => hasCarbonOffset,
  getArweaveUpload: ({ arweaveUpload }) => arweaveUpload,
}

export const mutations: MutationTree<PreferencesState> = {
  SET_LAYOUT_CLASS(state: PreferencesState, data) {
    state.layoutClass = data
  },
  SET_ADVANCED_UI(state: PreferencesState, data) {
    // if set to false reset state back to default
    if (!data) {
      state.layoutClass = 'is-half-desktop is-half-tablet'
      state.theatreView = 'theatre'
      state.compactGalleryItem = true
      state.compactCollection = false
      state.showPriceGallery = false
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
  SET_SHOW_PRICE(state: PreferencesState, data) {
    state.showPriceGallery = data
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
  SET_HAS_SUPPORT(state: PreferencesState, data) {
    state.hasSupport = data
  },
  SET_HAS_CARBON_OFFSET(state: PreferencesState, data) {
    state.hasCarbonOffset = data
  },
  SET_ARWEAVE_UPLOAD(state: PreferencesState, data) {
    state.arweaveUpload = data
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
  setShowPriceValue({ commit }: { commit: Commit }, data) {
    commit('SET_SHOW_PRICE', data)
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
  setHasSupport({ commit }: { commit: Commit }, data) {
    commit('SET_HAS_SUPPORT', data)
  },
  setHasCarbonOffset({ commit }: { commit: Commit }, data) {
    commit('SET_HAS_CARBON_OFFSET', data)
  },
  setArweaveUpload({ commit }: { commit: Commit }, data) {
    commit('SET_ARWEAVE_UPLOAD', data)
  },
}
