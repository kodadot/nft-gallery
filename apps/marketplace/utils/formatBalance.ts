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

export default format
