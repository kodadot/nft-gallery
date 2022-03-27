/* eslint-disable @typescript-eslint/no-loss-of-precision */

import { checkInvalidBalanceFilter } from '@/utils/formatBalance'
import format from '@/utils/formatBalance'

describe('FORMAT BALANCE TEST', (): void => {
  it('TEST checkInvalidBalanceFilter', () => {
    expect(checkInvalidBalanceFilter('0')).toBe('0')
    expect(checkInvalidBalanceFilter('100')).toBe('100')
    expect(checkInvalidBalanceFilter(Infinity)).toBe('0')
  })

  it('TEST format', () => {
    const decimals = 12
    expect(format(0, decimals)).toBe('0')
    expect(format(999999999999, decimals)).toBe('0.9999 Unit')
    expect(format(1000000000000, decimals)).toBe('1.0000 Unit')
    expect(format(6600000000000, decimals)).toBe('6.6000 Unit')

    const formatBalance = (balance) => format(balance, decimals, '')
    expect(formatBalance(217777560000000000)).toBe('217,777.5600')
    expect(formatBalance(98000000000000000)).toBe('98,000.0000')
    expect(formatBalance(23142594502346668)).toBe('23,142.5945')
    expect(formatBalance(15758922666666668)).toBe('15,758.9226')
    expect(formatBalance(2704625290567493)).toBe('2,704.6252')
    expect(formatBalance(2307841130985915.5)).toBe('2,307.8411')
    expect(formatBalance(1980632081712062.2)).toBe('1,980.6320')
    expect(formatBalance(1567020000000000)).toBe('1,567.0200')
    expect(formatBalance(1089218822222222.2)).toBe('1,089.2188')
    expect(formatBalance(1060330916129032.2)).toBe('1,060.3309')
  })
})
