import { oldKsm } from './chains'
import type { BackwardPrefix, Prefix } from './types'

export const SERVICES: Record<string, string> = {
  directUpload: 'https://direct-upload.w.kodadot.xyz/',
  nftStorage: 'https://nft-storage.w.kodadot.xyz/',
  seoCard: 'https://og-image-green-seven.vercel.app/',
  replicate: 'https://replicate.w.kodadot.xyz/',
  image: 'https://image.w.kodadot.xyz/',
  imageBeta: 'https://image-beta.w.kodadot.xyz/',
}

export const EXPLORERS: Record<Prefix, string> = {
  ksm: 'https://kusama.subscan.io/account/',
  rmrk2: 'https://kusama.subscan.io/account/',
  bsx: 'https://basilisk.subscan.io/account/',
  snek: 'https://calamar.play.hydration.cloud/rococo%20basilisk/search?query=',
  movr: 'https://moonriver.subscan.io/account/',
  glmr: 'https://moonbeam.subscan.io/account/',
}

export const hasExplorer = (prefix: BackwardPrefix): boolean => {
  return EXPLORERS[oldKsm(prefix)] !== undefined
}

export const getExplorer = (prefix: BackwardPrefix, id: string) => {
  return EXPLORERS[oldKsm(prefix)] + id
}
