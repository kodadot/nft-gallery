import { defineStore } from 'pinia'

interface State {
  // event type
  sale: boolean
  offer: boolean
  listing: boolean
  mint: boolean
  transfer: boolean
  // price
  min: number | undefined
  max: number | undefined
}

export const useAcivityFiltersStore = defineStore('activityFilters', {
  state: (): State => ({
    sale: false,
    offer: false,
    listing: false,
    mint: false,
    transfer: false,
    min: undefined,
    max: undefined,
  }),
  getters: {
    getEventTypeFilters: ({ sale, offer, listing, mint, transfer }) => ({
      sale,
      offer,
      listing,
      mint,
      transfer,
    }),
    getPriceRange: (state) => ({ min: state.min, max: state.max }),
  },
  actions: {
    setSale(payload) {
      this.sale = payload
    },
    setOffer(payload) {
      this.offer = payload
    },
    setListing(payload) {
      this.listing = payload
    },
    setMint(payload) {
      this.mint = payload
    },
    setTransfer(payload) {
      this.transfer = payload
    },
    setMin(payload) {
      this.min = payload
    },
    setMax(payload) {
      this.max = payload
    },
    setFilters(payload) {
      this.sale = Boolean(payload.sale)
      this.offer = Boolean(payload.offer)
      this.listing = Boolean(payload.listing)
      this.mint = Boolean(payload.mint)
      this.transfer = Boolean(payload.transfer)
    },
    setPriceRange(payload) {
      this.min = payload.min
      this.max = payload.max
    },
  },
})
