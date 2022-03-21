/**
 * @jest-environment jsdom
 */

import { checkInvalidBalanceFilter } from '@/utils/formatBalance'
import format from '@/utils/formatBalance'

describe('FORMAT BALANCE TEST', (): void => {
  it('TEST checkInvalidBalanceFilter', () => {
    expect(checkInvalidBalanceFilter('0')).toBe('0')
    expect(checkInvalidBalanceFilter('100')).toBe('100')
    expect(checkInvalidBalanceFilter(Infinity)).toBe('0')
  })

  it('TEST format', () => {
    expect(format(0, 12)).toBe('0')
    expect(format(999999999999, 12)).toBe('0.9999 Unit')
    expect(format(1000000000000, 12)).toBe('1.0000 Unit')
    expect(format(6600000000000, 12)).toBe('6.6000 Unit')
  })
})
