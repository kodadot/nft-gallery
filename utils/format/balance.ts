import { trimAll } from '@kodadot1/minimark'
import BN from 'bn.js'
import { formatBalance } from '@polkadot/util'

function format(
  balance: number | string | BN | bigint,
  decimals = 12,
  withUnit?: boolean | string,
  withSi?: boolean
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

export function calculateBalance(value: number, decimals = 12): number {
  return Math.trunc(value * Math.pow(10, decimals))
}

export function checkInvalidBalanceFilter(value) {
  if (value === Infinity) {
    return '0'
  }
  return value
}

export function roundTo(value: number | string, limit: number) {
  const number = Number(value.toLocaleString().replace(/,/g, ''))
  const hasDecimals = number % 1 !== 0
  // `undefined` params in toLocaleString() means use host default language
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString#using_options
  const fractionDigits = hasDecimals ? limit : 0
  return number.toLocaleString(undefined, {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })
}

export const formatBalanceEmptyOnZero = (
  amount: string,
  decimals?: number,
  symbol?: string
) => {
  return amount === '0'
    ? ''
    : trimAll(format(amount, decimals || 12, symbol || 'KSM'))
}

export const formatBsxBalanceEmptyOnZero = (
  amount: string,
  decimals?: number,
  symbol?: string
): string => {
  if (amount === '0' || amount == undefined) {
    return ''
  }

  const formatedBalance = format(amount, decimals || 12, symbol || 'BSX')
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
  return parseFloat(format(amount, 12, false).replace(/,/g, ''))
}

export default format
