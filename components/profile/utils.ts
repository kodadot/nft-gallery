import { ProfileTab } from './types'
import { TradeType } from '@/composables/useTrades'

type LinkableBlock = {
  id: string
  regex: RegExp
  template: (match: string) => string
}

export const LINKABLE_BLOCKS: LinkableBlock[] = [
  {
    id: 'channel',
    regex: /^\/\w+(?=[^\w]|$)/,
    template: (match: string) => `https://warpcast.com/~/channel/${match.slice(1)}`,
  },
  {
    id: 'user',
    regex: /^@\w{1,15}(?=[^\w]|$)/,
    template: (match: string) => `https://warpcast.com/${match.slice(1)}`,
  },
]

export const createLink = (content: string, url: string) => `[${content}](${url})`

const processSegment = (segment: string): string => {
  for (const { regex, template } of LINKABLE_BLOCKS) {
    const match = segment.match(regex)
    if (match) {
      const trailingText = segment.slice(match.index! + match[0].length)
      return createLink(match[0], template(match[0])) + trailingText
    }
  }

  return segment
}

export const getBioWithLinks = (text: string): string => {
  return text
    .split(/(\s+)/)
    .map(processSegment)
    .join('')
}

export const TRADE_TYPE_TO_PROFILE_TAB_MAP: Record<TradeType, ProfileTab> = {
  [TradeType.OFFER]: ProfileTab.OFFERS,
  [TradeType.SWAP]: ProfileTab.SWAPS,
}
