import { defineStore } from 'pinia'

type CompletePurchaseModalState = {
  isOpen: boolean
  mode: 'shopping-cart' | 'buy-now'
}

export enum GridSection {
  EXPLORE_GALLERY = 'explore-gallery',
  PROFILE_GALLERY = 'profile-gallery',
}

export const DEFAULT_GRID_SECTION = GridSection.EXPLORE_GALLERY
export type GridSize = 'small' | 'medium' | 'large'
type GridConfig = { section: GridSection; class: string; size: GridSize }

export const smallGridLayout = 'is-half-desktop is-half-tablet is-half-mobile'
export const largeGridLayout =
  'is-one-quarter-desktop is-one-third-tablet is-half-mobile'

const defaultGridConfigs: GridConfig[] = [
  { section: DEFAULT_GRID_SECTION, class: smallGridLayout, size: 'small' },
  {
    section: GridSection.PROFILE_GALLERY,
    class: largeGridLayout,
    size: 'large',
  },
]

interface State {
  sidebarFilterCollapseOpen: boolean
  mobileFilterCollapseOpen: boolean
  notificationBoxCollapseOpen: boolean
  shoppingCartCollapseOpen: boolean
  listingCartModalOpen: boolean
  completePurchaseModal: CompletePurchaseModalState
  triggerBuySuccess: boolean
  // Layout
  layoutClass: string
  gridConfigs: GridConfig[]
  gridSize: GridSize
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
  firstTimeAutoTeleport: boolean
  subscribedToNewsletter: boolean
  // Minting
  hasSupport: boolean
  hasCarbonOffset: boolean
  // Mass Mint
  visitedOnboarding: boolean
  userLocale: string
}

export const usePreferencesStore = defineStore('preferences', {
  state: (): State => ({
    sidebarFilterCollapseOpen: true,
    mobileFilterCollapseOpen: false,
    notificationBoxCollapseOpen: false,
    listingCartModalOpen: false,
    shoppingCartCollapseOpen: false,
    completePurchaseModal: {
      isOpen: false,
      mode: 'shopping-cart',
    },
    triggerBuySuccess: false,
    layoutClass: 'is-one-quarter-desktop is-one-third-tablet',
    gridConfigs: defaultGridConfigs,
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
    hasCarbonOffset: false,
    enableAllArtwork: true,
    enableGyroEffect: false,
    gridSize: 'small',
    visitedOnboarding: false,
    firstTimeAutoTeleport: true,
    subscribedToNewsletter: false,
    userLocale: 'en',
  }),
  getters: {
    getsidebarFilterCollapse: (state) => state.sidebarFilterCollapseOpen,
    getMobileFilterCollapse: (state) => state.mobileFilterCollapseOpen,
    getNotificationBoxCollapse: (state) => state.notificationBoxCollapseOpen,
    getShoppingCartCollapse: (state) => state.shoppingCartCollapseOpen,
    getCompletePurchaseModal: (state) => state.completePurchaseModal,
    getTriggerBuySuccess: (state) => state.triggerBuySuccess,
    getLayoutClass: (state) => state.layoutClass,
    getGridConfigBySection: (state) => (section: GridSection) =>
      state.gridConfigs.find((grid) => grid.section === section),
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
    getLoadAllArtwork: (state) => state.enableAllArtwork,
    getEnableGyroEffect: (state) => state.enableGyroEffect,
    getVisitedOnboarding: (state) => state.visitedOnboarding,
    getFirstTimeAutoTeleport: (state) => state.firstTimeAutoTeleport,
    getSubscribedToNewsletter: (state) => state.subscribedToNewsletter,
    getUserLocale: (state) => state.userLocale,
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
    setCompletePurchaseModal(payload: CompletePurchaseModalState) {
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
    setAdvancedUI(payload) {
      // if set to false reset state back to default
      if (!payload) {
        this.layoutClass = 'is-one-quarter-desktop is-one-third-tablet'
        this.gridConfigs = defaultGridConfigs
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
    setAllArtworkVisible(payload) {
      this.enableAllArtwork = payload
    },
    setEnableGyroEffect(payload) {
      this.enableGyroEffect = payload
    },
    setGridSize(payload) {
      this.gridSize = payload
    },
    setGridConfig({ class: layoutClass, size, section }: GridConfig) {
      const gridConfig = this.getGridConfigBySection(section)
      if (gridConfig) {
        gridConfig.size = size
        gridConfig.class = layoutClass
      }
    },
    setVisitedOnboarding(payload: boolean) {
      this.visitedOnboarding = payload
    },
    setFirstTimeAutoTeleport(firstTime: boolean) {
      this.firstTimeAutoTeleport = firstTime
    },
    setSubscribedToNewsletter(subscribed: boolean) {
      this.subscribedToNewsletter = subscribed
    },
    setUserLocale(locale: string) {
      this.userLocale = locale
    },
  },
  persist: true,
})
