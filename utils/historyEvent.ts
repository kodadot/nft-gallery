import formatBalance from '@/utils/formatBalance'
import { Interaction } from '@kodadot1/minimark'

enum SpecialHistoryEventType {
  ALL = 'ALL',
}

export enum InteractionBsxOnly {
  ROYALTY = 'ROYALTY',
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

export const parseAmount = (
  amount: string,
  decimals: number,
  unit: string
): string => {
  return parseInt(amount) ? formatBalance(amount, decimals, unit) : '-'
}
