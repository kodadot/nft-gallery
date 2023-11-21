import {
  bsxDenyList,
  denyList,
  dotHubDenyList,
  ksmHubDenyList,
} from '@/utils/constants'

export function getDenyList(prefix: string): string[] | undefined {
  switch (prefix) {
    case 'rmrk':
    case 'ksm':
      return denyList
    case 'bsx':
      return bsxDenyList
    case 'ahk':
      return ksmHubDenyList
    case 'ahp':
      return dotHubDenyList
    default:
      return undefined
  }
}

export function isRemark(prefix: string): boolean {
  return prefix === 'rmrk'
}

export const hasMarketplace = (prefix: string): boolean =>
  ['rmrk', 'bsx'].includes(prefix)
