import BN from 'bn.js'
import { isNumber } from '@polkadot/util'
import { sanitizeIpfsUrl } from '@/components/rmrk/utils'
const EMPTY = '0.00 %'

export const toNumber = (value: BN | number): number => BN.isBN(value) ? Number(value.toString()) : value || 0

export const toString = (value: any) => (value && value.toString()) || ''

export const toPercent = (value: number | undefined | BN): string => {
  if (!value) {
    return EMPTY
  }

  if (isNumber(value)) {
    return Number.isInteger(value) ? `${value}.00 %` : `${value} %`
  }

  if (BN.isBN(value)) {
    return `${value.toString()} %`
  }

  return EMPTY
}

export const truncateStr = (s: string, maxLen  = 20): string => {
  if (s.length <= maxLen) {
    return s
  }
  return s.substring(0, maxLen) + '...'
}

export const toSanitizedUrl = (value: string): string  => sanitizeIpfsUrl(value)
