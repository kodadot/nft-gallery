import { dotHubDenyList, ksmHubDenyList } from '@/utils/constants'

export function getDenyList(prefix: string): string[] | undefined {
  switch (prefix) {
    case 'ahk':
      return ksmHubDenyList
    case 'ahp':
      return dotHubDenyList
    default:
      return undefined
  }
}

export const hasMarketplace = (prefix: string): boolean =>
  ['ahp', 'ahk'].includes(prefix)

export const hasOperationsDisabled = (_: string): boolean => false
