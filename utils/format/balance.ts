import { trimAll } from '@kodadot1/minimark'
import formatBalance from '@/utils/formatBalance'

export const formatBalanceEmptyOnZero = (
  amount: string,
  decimals?: number,
  symbol?: string
) => {
  return amount === '0'
    ? ''
    : trimAll(formatBalance(amount, decimals || 12, symbol || 'KSM'))
}

export const formatBsxBalanceEmptyOnZero = (
  amount: string,
  decimals?: number,
  symbol?: string
) => {
  return amount === '0'
    ? ''
    : Number(
        formatBalance(amount, decimals || 12, symbol || 'KSM')
      ).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
}
