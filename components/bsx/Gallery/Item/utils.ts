import type { ApiPromise } from '@polkadot/api'

export function getMetadata(api: ApiPromise) {
  return api.query.nft.instances
}

export function getMarketplaceData(api: ApiPromise) {
  return api.query.nft.instances
}

export function getPrice(api: ApiPromise) {
  return api.query.marketplace.prices
}

export function getOffers(api: ApiPromise) {
  return api.query.marketplace.offers.keys
}

export function getOwner(api: ApiPromise) {
  return api.query.uniques.asset
}

export function hasAllPallets(api: ApiPromise): boolean {
  return [api.query.uniques, api.query.nft, api.query.marketplace].every(
    (pallet) => pallet
  )
}
