import formatBalance from '@/utils/format/balance'
import { Interaction } from '@kodadot1/minimark'

enum SpecialHistoryEventType {
  ALL = 'ALL',
}

export enum InteractionBsxOnly {
  ROYALTY = 'ROYALTY',
  PAY_ROYALTY = 'PAY_ROYALTY',
}
export type HistoryEventType =
  | Interaction
  | SpecialHistoryEventType
  | InteractionBsxOnly
export const HistoryEventType = {
  ...InteractionBsxOnly,
  ...SpecialHistoryEventType,
  ...Interaction,
}

export const eventToIconMap = {
  [Interaction.MINTNFT]: '🖼',
  [Interaction.LIST]: '📰',
  [Interaction.UNLIST]: '🗞',
  [Interaction.SEND]: '🎁',
  [Interaction.CONSUME]: '🔥',
  [Interaction.BUY]: '🤝',
  [InteractionBsxOnly.ROYALTY]: '👑',
  [InteractionBsxOnly.PAY_ROYALTY]: '💰',
}

export const wrapEventNameWithIcon = (
  type: Interaction | InteractionBsxOnly,
  eventName: string
): string => `${eventToIconMap[type]} ${eventName}`

export const parseDate = (date: Date): string => {
  return date.toLocaleString('en-GB', {
    timeZone: 'UTC',
    timeZoneName: 'short',
  })
}

export const parseChartAmount = (amount: string, decimals: number): number => {
  return parseFloat(formatBalance(amount, decimals))
}
