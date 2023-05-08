import type { Prefix } from './types'

export const SERVICES: Record<string, string> = {
  directUpload: 'https://direct-upload.w.kodadot.xyz/',
  nftStorage: 'https://nft-storage.w.kodadot.xyz/',
  seoCard: 'https://og-image-green-seven.vercel.app/',
  replicate: 'https://replicate.w.kodadot.xyz/',
  image: 'https://image.w.kodadot.xyz/',
  imageBeta: 'https://image-beta.w.kodadot.xyz/',
}

export const EXPLORERS: Record<Prefix, string> = {
  rmrk: 'https://kusama.subscan.io/account/',
  ksm: 'https://kusama.subscan.io/account/',
  bsx: 'https://basilisk.subscan.io/account/',
  snek: 'https://calamar.play.hydration.cloud/rococo%20basilisk/search?query=',
  movr: 'https://moonriver.subscan.io/account/',
  glmr: 'https://moonbeam.subscan.io/account/',
  stmn: 'https://statemine.subscan.io/account/',
}

export const hasExplorer = (prefix: Prefix): boolean => {
  return EXPLORERS[prefix] !== undefined
}

export const getExplorer = (prefix: Prefix, id: string) => {
  return EXPLORERS[prefix] + id
}
