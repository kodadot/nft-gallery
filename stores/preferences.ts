import { defineStore } from 'pinia'

type completePurchaseModalState = {
  isOpen: boolean
  mode: 'shopping-cart' | 'buy-now'
}

interface State {
  sidebarFilterCollapseOpen: boolean
  mobileFilterCollapseOpen: boolean
  notificationBoxCollapseOpen: boolean
  shoppingCartCollapseOpen: boolean
  completePurchaseModal: completePurchaseModalState
  triggerBuySuccess: boolean
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
  // Mass Mint
  visitedOnboarding: boolean
}

export const usePreferencesStore = defineStore('preferences', {
  state: (): State => ({
    sidebarFilterCollapseOpen: true,
    mobileFilterCollapseOpen: false,
    notificationBoxCollapseOpen: false,
    shoppingCartCollapseOpen: false,
    completePurchaseModal: {
      isOpen: false,
      mode: 'shopping-cart',
    },
    triggerBuySuccess: false,
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
    visitedOnboarding: false,
  }),
  getters: {
    getsidebarFilterCollapse: (state) => state.sidebarFilterCollapseOpen,
    getMobileFilterCollapse: (state) => state.mobileFilterCollapseOpen,
    getNotificationBoxCollapse: (state) => state.notificationBoxCollapseOpen,
    getShoppingCartCollapse: (state) => state.shoppingCartCollapseOpen,
    getCompletePurchaseModal: (state) => state.completePurchaseModal,
    getTriggerBuySuccess: (state) => state.triggerBuySuccess,
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
    getVisitedOnboarding: (state) => state.visitedOnboarding,
  },
  actions: {
    setSidebarFilterCollapse(payload) {
      this.sidebarFilterCollapseOpen = payload
    },
    setMobileFilterCollapse(payload) {
      this.mobileFilterCollapseOpen = payload
    },
    setNotificationBoxCollapse(payload) {
      this.notificationBoxCollapseOpen = payload
    },
    setShoppingCartCollapse(payload) {
      this.shoppingCartCollapseOpen = payload
    },
    setCompletePurchaseModal(payload: completePurchaseModalState) {
      this.completePurchaseModal = payload
    },
    setCompletePurchaseModalOpen(payload) {
      this.completePurchaseModal.isOpen = payload
    },
    setTriggerBuySuccess(payload) {
      this.triggerBuySuccess = payload
    },
    setLayoutClass(payload) {
      this.layoutClass = payload
    },
    setGalleryLayoutClass(payload) {
      this.galleryLayoutClass = payload
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
      this.compactGalleryItem = payload
    },
    setCompactCollection(payload) {
      this.compactCollection = payload
    },
    setShowPriceValue(payload) {
      this.showPriceGallery = payload
    },
    setShowMintTime(payload) {
      this.showMintTimeCollection = payload
    },
    setGalleryItemsPerPage(payload) {
      this.galleryItemsPerPage = payload
    },
    setCollectionsPerPage(payload) {
      this.collectionsPerPage = payload
    },
    setExploreTabOrder(payload) {
      this.exploreTabOrder = payload
    },
    setReplaceBuyNowWithYolo(payload) {
      this.replaceBuyNowWithYolo = payload
    },
    setHasSupport(payload) {
      this.hasSupport = payload
    },
    setHasCarbonOffset(payload) {
      this.hasCarbonOffset = payload
    },
    setArweaveUpload(payload) {
      this.arweaveUpload = payload
    },
    setAllArtworkVisible(payload) {
      this.enableAllArtwork = payload
    },
    setEnableGyroEffect(payload) {
      this.enableGyroEffect = payload
    },
    setGridSize(payload) {
      this.gridSize = payload
    },
    setVisitedOnboarding(payload: boolean) {
      this.visitedOnboarding = payload
    },
  },
  persist: true,
})
