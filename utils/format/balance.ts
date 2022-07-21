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
): string => {
  if (amount === '0' || amount == undefined) {
    return ''
  }

  const formatedBalance = formatBalance(amount, decimals || 12, symbol || 'BSX')
  const number = Number(formatedBalance.split(' ')[0].replace(/,/g, ''))
  const hasDecimals = number % 1 !== 0
  const fractionDigits = hasDecimals ? decimals : 0

  return (
    number.toLocaleString(undefined, {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    }) + ' BSX'
  )
}

export const formatBsxBalanceToNumber = (amount) => {
  return parseFloat(formatBalance(amount, 12, false).replace(/,/g, ''))
}
