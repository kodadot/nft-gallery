import { isWithinInterval, subDays } from 'date-fns'

export function parseDate(ts: number | Date): string {
  return new Date(ts).toLocaleString()
}

export const isDateWithinLastDays = (date: Date, days: number) =>
  isWithinInterval(date, {
    start: subDays(new Date(), days),
    end: new Date(),
  })
