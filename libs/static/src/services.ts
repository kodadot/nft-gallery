import type { Prefix } from './types'

export const SERVICES: Record<string, string> = {
  directUpload: 'https://direct-upload.w.kodadot.xyz/',
  nftStorage: 'https://ipos.w.kodadot.xyz/',
  seoCard: 'https://og-image-green-seven.vercel.app/',
  replicate: 'https://replicate.w.kodadot.xyz/',
  image: 'https://image.w.kodadot.xyz/',
  imageBeta: 'https://image-beta.w.kodadot.xyz/',
}

export const EXPLORERS: Record<Prefix, string> = {
  ksm: 'https://kusama.subscan.io/account/',
  ahk: 'https://assethub-kusama.subscan.io/account/',
  dot: 'https://polkadot.subscan.io/account/',
  ahp: 'https://assethub-polkadot.subscan.io/account/',
  base: 'https://basescan.org/address/',
  ahw: 'https://assethub-westend.subscan.io/account/',
  // ahr: 'https://assethub-rococo.subscan.io/account/',
  // movr: 'https://moonriver.subscan.io/account/',
  // glmr: 'https://moonbeam.subscan.io/account/',
}

export const hasExplorer = (prefix: Prefix): boolean => {
  return EXPLORERS[prefix] !== undefined
}

export const getExplorer = (prefix: Prefix, id: string) => {
  return EXPLORERS[prefix] + id
}
