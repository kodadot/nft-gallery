import { Interaction } from '@kodadot1/static'
import formatBalance from '@/utils/format/balance'

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

export const parseChartAmount = (amount: string, decimals: number): number => {
  return parseFloat(formatBalance(amount, decimals))
}
