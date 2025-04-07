import { formatISO, subDays } from 'date-fns'
import type { SortType } from './types'
import type { Interaction } from '@/types'
import { after, between, getVolume } from '@/utils/math'

export const today = new Date()
export const yesterdayDate: Date = subDays(today, 1)
export const lastweekDate: Date = subDays(today, 7)
export const lastmonthDate: Date = subDays(today, 30)
export const last3monthDate: Date = subDays(today, 90)
export const sub2dayDate: Date = subDays(today, 2)
export const last2weekDate: Date = subDays(today, 14)
export const last2monthDate: Date = subDays(today, 60)
export const last6monthDate: Date = subDays(today, 60)
export const volume = (buyEvents: Interaction[]) => Number(getVolume(buyEvents))

export const weeklyVolume = (buyEvents: Interaction[]) =>
  Number(getVolume(buyEvents.filter(after(lastweekDate))))

export const monthlyVolume = (buyEvents: Interaction[]) =>
  Number(getVolume(buyEvents.filter(after(lastmonthDate))))

export const threeMonthlyVolume = (buyEvents: Interaction[]) =>
  Number(getVolume(buyEvents.filter(after(last3monthDate))))

export const dailyrangeVolume = (buyEvents: Interaction[]) =>
  Number(getVolume(buyEvents.filter(between(sub2dayDate, yesterdayDate))))

export const weeklyrangeVolume = (buyEvents: Interaction[]) =>
  Number(getVolume(buyEvents.filter(between(last2weekDate, lastweekDate))))

export const monthlyrangeVolume = (buyEvents: Interaction[]) =>
  Number(getVolume(buyEvents.filter(between(last2monthDate, lastmonthDate))))

export const threeMonthRangeVolume = (buyEvents: Interaction[]) =>
  Number(getVolume(buyEvents.filter(between(last6monthDate, last3monthDate))))

export const onlyDate = (datetime: Date) =>
  formatISO(datetime, { representation: 'date' })

export const toSort = (sortBy: SortType): string =>
  `${sortBy.field}_${sortBy.value}`

export function calculateAvgPrice(volume: string, buys: number): string {
  return String(Math.round(parseInt(volume) / buys))
}
