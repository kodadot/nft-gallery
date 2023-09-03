import formatBalance from '@/utils/format/balance'
import { Interaction } from '@kodadot1/minimark/v1'

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

export const parseDate = (date: Date): string => {
  return date.toLocaleString('en-GB', {
    timeZone: 'UTC',
    timeZoneName: 'short',
  })
}

export const parseChartAmount = (amount: string, decimals: number): number => {
  return parseFloat(formatBalance(amount, decimals))
}
