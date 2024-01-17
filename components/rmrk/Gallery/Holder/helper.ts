import formatBalance from '@/utils/format/balance'

export const parsePriceForItem = (item, decimals, unit) => {
  item['BoughtFormatted'] = parseInt(item['Bought'])
    ? formatBalance(item['Bought'], decimals, unit)
    : '-'
  item['SaleFormatted'] = parseInt(item['Sale'])
    ? formatBalance(item['Sale'], decimals, unit)
    : '-'
  item['Percentage'] =
    item['Bought'] && item['Sale'] ? (item['Sale'] / item['Bought']) * 100 : 0
}
