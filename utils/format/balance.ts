import { trimAll } from '@kodadot1/minimark/utils'
import BN from 'bn.js'
import { formatBalance } from '@polkadot/util'

function format(
  balance: number | string | BN | bigint,
  decimals = 12,
  withUnit?: boolean | string,
  withSi?: boolean,
) {
  try {
    const fixedBalance =
      typeof balance === 'number' ? balance.toFixed() : balance

    return formatBalance(fixedBalance, {
      decimals,
      withUnit,
      forceUnit: '-',
      withSi,
    })
  } catch (e: any) {
    return ''
  }
}

export function formatNumber(amount?: string | number): string {
  if (!amount) {
    return '0'
  }
  const number =
    typeof amount === 'number' ? amount : Number(withoutDigitSeparator(amount))

  let formattedNumber
  if (number >= 1000000) {
    formattedNumber = (number / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  } else if (number >= 1000) {
    formattedNumber = (number / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  } else if (number === 0) {
    formattedNumber = '0'
  } else if (number < 0.001) {
    formattedNumber = number.toFixed(4)
  } else if (number < 0.01) {
    formattedNumber = number.toFixed(3)
  } else if (number < 0.1) {
    formattedNumber = number.toFixed(2)
  } else {
    formattedNumber = number.toFixed(1).replace(/\.0$/, '')
  }
  return formattedNumber
}

export function calculateBalance(value: number, decimals = 12): number {
  return Math.trunc(value * Math.pow(10, decimals))
}
export function calculateBalanceUsdValue(
  value: number,
  decimals = 12,
  fractionDigits = 4,
): number {
  return parseFloat((value / Math.pow(10, decimals)).toFixed(fractionDigits))
}

export function checkInvalidBalanceFilter(value) {
  if (value === Infinity) {
    return '0'
  }
  return value
}

export function withoutDigitSeparator(value: string) {
  return value.replace(/,/g, '')
}

export function roundTo(value: number | string, limit = 2) {
  const number = Number(value.toString().replace(/,/g, ''))
  const hasDecimals = number % 1 !== 0
  const fractionDigits = hasDecimals ? limit : 0
  return number.toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })
}

export const formatBalanceEmptyOnZero = (
  amount: string,
  decimals?: number,
  symbol?: string,
) => {
  return amount === '0'
    ? ''
    : trimAll(format(amount, decimals || 12, symbol || 'KSM'))
}

export const roundAmount = (
  value: string,
  limit: number,
  disableFilter: boolean,
) => {
  const number = Number(value.replace(/,/g, ''))
  return parseFloat(disableFilter ? number.toString() : roundTo(value, limit))
}

export default format
