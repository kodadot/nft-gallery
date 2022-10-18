import { HistoryItem } from '~/store/history'

export const filterHistoryItemByPrefix = (
  historyItems: HistoryItem[],
  prefix: string
): HistoryItem[] => {
  return historyItems.filter((item) => {
    if (prefix === 'rmrk' && !item.prefix) {
      return true
    }
    return item.prefix === prefix
  })
}
