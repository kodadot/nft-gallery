import formatBalance from '@/utils/formatBalance'

export const parsePriceForItem = (item, decimals, unit) => {
  item['BoughtFormatted'] = parseInt(item['Bought'])
    ? formatBalance(item['Bought'], decimals, unit)
    : '-'
  item['SaleFormatted'] = parseInt(item['Sale'])
    ? formatBalance(item['Sale'], decimals, unit)
    : '-'
}

export const parseDate = (date: Date): string => {
  const utcDate: string = date.toUTCString()
  return utcDate.substring(4)
}
