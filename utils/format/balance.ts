import BN from 'bn.js'
import { trimAll } from '@kodadot1/minimark'
import formatBalance from '@/utils/formatBalance'
import isUndefined from 'lodash/isUndefined'

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

type formatOptionsType = {
  emptyOnZero?: boolean
  decimals: number
  unit?: string
  round?: number
  withComma?: boolean
  symbol?: 'KSM' | 'BSX'
  trimAll?: boolean
}

export const format = (
  value: number | string | BN | bigint,
  option: formatOptionsType
): string | number => {
  if (isUndefined(value)) {
    return ''
  }
  const { emptyOnZero, decimals, symbol, round } = option

  if (emptyOnZero && (value === '0' || value === 0 || value === '')) {
    return ''
  }
  let balance = formatBalance(value, decimals, symbol)
  if (round) {
    balance = `${roundBalance(balance, round, decimals)} ${symbol}`
  }

  return balance
}

function roundBalance(balance: string, round: number, decimals): string {
  const number = Number(balance.split(' ')[0].replace(/,/g, ''))
  const hasDecimals = number % 1 !== 0
  const fractionDigits = hasDecimals ? decimals : 0

  return number.toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })
}
