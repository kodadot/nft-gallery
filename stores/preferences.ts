import { defineStore } from 'pinia'

interface State {
  sidebarFilterCollapseOpen: boolean
  mobileFilterCollapseOpen: boolean
  layoutClass: string
  galleryLayoutClass: string
  advancedUI: boolean
  theatreView: string
  compactGalleryItem: boolean
  compactCollection: boolean
  showPriceGallery: boolean
  showMintTimeCollection: boolean
  galleryItemsPerPage: number
  collectionsPerPage: number
  exploreTabOrder: string
  historyItemsPerPage: number
  replaceBuyNowWithYolo: boolean
  enableAllArtwork: boolean
  enableGyroEffect: boolean
  gridSize: 'small' | 'medium' | 'large'
  // Minting
  hasSupport: boolean
  hasCarbonOffset: boolean
  arweaveUpload: boolean
}

export const usePreferencesStore = defineStore('preferences', {
  state: (): State => ({
    sidebarFilterCollapseOpen: true,
    mobileFilterCollapseOpen: false,
    layoutClass: 'is-one-quarter-desktop is-one-third-tablet',
    galleryLayoutClass:
      'is-one-quarter-desktop is-one-third-tablet is-half-mobile',
    advancedUI: false,
    theatreView: 'default',
    compactGalleryItem: true,
    compactCollection: false,
    showPriceGallery: false,
    showMintTimeCollection: false,
    galleryItemsPerPage: 12,
    collectionsPerPage: 9,
    exploreTabOrder: 'COLLECTION',
    historyItemsPerPage: 12,
    replaceBuyNowWithYolo: false,
    hasSupport: true,
    hasCarbonOffset: true,
    arweaveUpload: false,
    enableAllArtwork: true,
    enableGyroEffect: false,
    gridSize: 'small',
  }),
  getters: {
    getsidebarFilterCollapse: (state) => state.sidebarFilterCollapseOpen,
    getMobileFilterCollapse: (state) => state.mobileFilterCollapseOpen,
    getLayoutClass: (state) => state.layoutClass,
    getGalleryLayoutClass: (state) => state.galleryLayoutClass,
    getTheatreView: (state) => state.theatreView,
    getCompactCollection: (state) => state.compactCollection,
    getShowPriceValue: (state) => state.showPriceGallery,
    getShowMintTime: (state) => state.showMintTimeCollection,
    getGalleryItemsPerPage: (state) => state.galleryItemsPerPage,
    getCollectionsPerPage: (state) => state.collectionsPerPage,
    getExploreTabOrder: (state) => state.exploreTabOrder,
    getHistoryItemsPerPage: (state) => state.historyItemsPerPage,
    getReplaceBuyNowWithYolo: (state) => state.replaceBuyNowWithYolo,
    getHasSupport: (state) => state.hasSupport,
    getHasCarbonOffset: (state) => state.hasCarbonOffset,
    getArweaveUpload: (state) => state.arweaveUpload,
    getLoadAllArtwork: (state) => state.enableAllArtwork,
    getEnableGyroEffect: (state) => state.enableGyroEffect,
    getGridSize: (state) => state.gridSize,
  },
  actions: {
    setSidebarFilterCollapse(payload) {
      this.setSidebarFilterCollapse = payload
    },
    setMobileFilterCollapse(payload) {
      this.setMobileFilterCollapse = payload
    },
    setLayoutClass(payload) {
      this.setLayoutClass = payload
    },
    setGalleryLayoutClass(payload) {
      this.setGalleryLayoutClass = payload
    },
    setAdvancedUI(payload) {
      // if set to false reset state back to default
      if (!payload) {
        this.layoutClass = 'is-one-quarter-desktop is-one-third-tablet'
        this.galleryLayoutClass =
          'is-one-quarter-desktop is-one-third-tablet is-half-mobile'
        this.theatreView = 'theatre'
        this.compactGalleryItem = true
        this.compactCollection = false
        this.showPriceGallery = false
        this.galleryItemsPerPage = 12
        this.collectionsPerPage = 9
        this.exploreTabOrder = 'COLLECTION'
        this.historyItemsPerPage = 12
      }
      this.advancedUI = payload
    },
    setTheatreView(payload) {
      this.theatreView = payload ? 'theatre' : 'default'
    },
    setCompactGalleryItem(payload) {
      this.setCompactGalleryItem = payload
    },
    setCompactCollection(payload) {
      this.setCompactCollection = payload
    },
    setShowPriceValue(payload) {
      this.setShowPriceValue = payload
    },
    setShowMintTime(payload) {
      this.setShowMintTime = payload
    },
    setGalleryItemsPerPage(payload) {
      this.setGalleryItemsPerPage = payload
    },
    setCollectionsPerPage(payload) {
      this.setCollectionsPerPage = payload
    },
    setExploreTabOrder(payload) {
      this.setExploreTabOrder = payload
    },
    setReplaceBuyNowWithYolo(payload) {
      this.setReplaceBuyNowWithYolo = payload
    },
    setHasSupport(payload) {
      this.setHasSupport = payload
    },
    setHasCarbonOffset(payload) {
      this.setHasCarbonOffset = payload
    },
    setArweaveUpload(payload) {
      this.setArweaveUpload = payload
    },
    setAllArtworkVisible(payload) {
      this.setAllArtworkVisible = payload
    },
    setEnableGyroEffect(payload) {
      this.enableGyroEffect = payload
    },
    setGridSize(payload) {
      this.gridSize = payload
    },
  },
})
