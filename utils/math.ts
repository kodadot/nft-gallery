import { Interaction } from '@/components/rmrk/service/scheme'
import { isAfter, isBefore, isEqual, parseISO } from 'date-fns'
import consola from 'consola'

export function pairListBuyEvent(events: Interaction[]): Interaction[] {
  const res: Interaction[] = []
  try {
    events?.forEach((event, index) => {
      if (
        event.interaction === 'BUY' &&
        index >= 1 &&
        events[index - 1].interaction === 'LIST'
      ) {
        res.push(events[index - 1])
      }
    })
    return res
  } catch (error) {
    consola.error(error)
    return res
  }
}

export const sum = (array: number[]): number =>
  array.reduce((accumulator, currentValue) => accumulator + currentValue, 0)

export function getSum(list: Array<number | number>): bigint | number {
  return list
    .map((x) => x)
    .map((x) => BigInt(x || 0))
    .reduce((acc, cur) => acc + cur, BigInt(0))
}

export function getSumOfObjectField<T>(
  list: Array<T>,
  field: string
): bigint | number {
  return list
    .map((x) => Number(x[field]))
    .map((x) => BigInt(x || 0))
    .reduce((acc, cur) => acc + cur, BigInt(0))
}

export function getVolume(events: Interaction[]): bigint {
  return events
    .map((x) => x.meta)
    .map((x) => BigInt(x || 0))
    .reduce((acc, cur) => acc + cur, BigInt(0))
}

export const after =
  (date: Date) =>
  (event: Interaction): boolean =>
    isAfter(parseISO(event.timestamp), date) ||
    isEqual(parseISO(event.timestamp), date)

export const before =
  (date: Date) =>
  (event: Interaction): boolean =>
    isBefore(parseISO(event.timestamp), date) ||
    isEqual(parseISO(event.timestamp), date)

export const between =
  (dateA: Date, dateB: Date) =>
  (event: Interaction): boolean =>
    (isAfter(parseISO(event.timestamp), dateA) ||
      isEqual(parseISO(event.timestamp), dateA)) &&
    isBefore(parseISO(event.timestamp), dateB)

export function uniqueCount<T>(self: T[]): number {
  return new Set(self).size
}

export function toDecimals(value: number, decimals: number): number {
  return value * 10 ** decimals
}

export function fromDecimals(value: number, decimals: number): number {
  return value / 10 ** decimals
}
