import { denyList, dotHubDenyList, ksmHubDenyList } from '@/utils/constants'

export function getDenyList(prefix: string): string[] | undefined {
  switch (prefix) {
    case 'rmrk':
    case 'ksm':
      return denyList
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
  ['rmrk', 'ksm', 'ahp', 'ahk'].includes(prefix)
