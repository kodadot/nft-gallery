import { isAfter, isBefore, isEqual, parseISO } from 'date-fns'
import maxBy from 'lodash/maxBy'
import type { Interaction } from '@/types'

export const sum = (array: number[]): number =>
  array.reduce((accumulator, currentValue) => accumulator + currentValue, 0)

export function getSumOfObjectField<T>(
  list: Array<T>,
  field: string,
): bigint | number {
  return list
    .map(x => Number(x[field]))
    .map(x => BigInt(x || 0))
    .reduce((acc, cur) => acc + cur, BigInt(0))
}

export function getNumberSumOfObjectField<T>(
  list: Array<T>,
  field: string,
): number {
  return list
    .map(x => Number(x[field]) || 0)
    .reduce((acc, cur) => acc + cur, Number(0))
}

export function getVolume(events: { meta: string }[]): bigint {
  return events
    .map(x => x.meta)
    .map(x => BigInt(x || 0))
    .reduce((acc, cur) => acc + cur, BigInt(0))
}

export const after
  = (date: Date) =>
    (event: Interaction): boolean =>
      isAfter(parseISO(event.timestamp), date)
      || isEqual(parseISO(event.timestamp), date)

export const between
  = (dateA: Date, dateB: Date) =>
    (event: Interaction): boolean =>
      (isAfter(parseISO(event.timestamp), dateA)
        || isEqual(parseISO(event.timestamp), dateA))
        && isBefore(parseISO(event.timestamp), dateB)

export function toDecimals(value: number, decimals: number): number {
  return value * 10 ** decimals
}

export function fromDecimals(value: number, decimals: number): number {
  return value / 10 ** decimals
}

export function median(values: number[], sorted = false) {
  const sortedValues = sorted ? values : [...values.sort((a, b) => a - b)]
  const half = Math.floor(sortedValues.length / 2)
  if (sortedValues.length % 2) {
    // odd length of array
    return sortedValues[half]
  }
  // even length of array
  return (sortedValues[half - 1] + sortedValues[half]) / 2.0
}

//  median absolute deviation (MAD)
// https://en.wikipedia.org/wiki/Median_absolute_deviation
export function mediaAbsoluteDeviation(values: number[]) {
  const med = median(values)
  const devs = values.map(value => Math.abs(value - med))
  return median(devs)
}

export const getMaxKeyByValue = data =>
  maxBy(Object.keys(data), key => Number(data[key]))
