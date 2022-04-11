import BN from 'bn.js'
import { isNumber } from '@polkadot/util'
import { sanitizeIpfsUrl } from '@/components/rmrk/utils'
const EMPTY = '0.00 %'

export const toNumber = (value: BN | number): number =>
  BN.isBN(value) ? Number(value.toString()) : value || 0

export const toString = (value: any) => (value && value.toString()) || ''

export const toPercent = (
  value: number | undefined | BN,
  emptyStr: string = EMPTY
): string => {
  if (!value) {
    return emptyStr
  }

  if (isNumber(value)) {
    const floatNum = Number.parseFloat(value.toString()).toFixed(2)
    return `${floatNum} %`
  }

  if (BN.isBN(value)) {
    const bnPercent: string = value.toString()
    return `${bnPercent} %`
  }

  return emptyStr
}

export const truncateStr = (s: string, maxLen = 20): string => {
  if (s.length <= maxLen) {
    return s
  }
  return s.substring(0, maxLen) + '...'
}

export const toSanitizedUrl = (value: string): string => sanitizeIpfsUrl(value)
