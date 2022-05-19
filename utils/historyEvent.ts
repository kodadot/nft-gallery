import formatBalance from '@/utils/formatBalance'
import { Interaction } from '@kodadot1/minimark'

enum SpecialHistoryEventType {
  UNLIST = 'UNLIST',
  ALL = 'ALL',
}
export type HistoryEventType = Interaction | SpecialHistoryEventType
export const HistoryEventType = {
  ...Interaction,
  ...SpecialHistoryEventType,
}

export const eventToIconMap = {
  [HistoryEventType.MINTNFT]: '🖼',
  [HistoryEventType.LIST]: '📰',
  [HistoryEventType.UNLIST]: '🗞',
  [HistoryEventType.SEND]: '🎁',
  [HistoryEventType.CONSUME]: '🔥',
  [HistoryEventType.BUY]: '🤝',
}

export const wrapEventNameWithIcon = (
  type: HistoryEventType,
  eventName: string
) => `${eventToIconMap[type]} ${eventName}`

export const parseDate = (date: Date): string => {
  return date.toLocaleString('en-GB', {
    timeZone: 'UTC',
    timeZoneName: 'short',
  })
}

export const parseAmount = (
  amount: string,
  decimals: number,
  unit: string
): string => {
  return parseInt(amount) ? formatBalance(amount, decimals, unit) : '-'
}
