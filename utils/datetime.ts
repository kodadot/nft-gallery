import { format, isWithinInterval, subDays } from 'date-fns'

export function parseDate(ts: number | Date): string {
  return format(new Date(ts), 'HH:mm | dd.MM.yyyy')
}

export const isDateWithinLastDays = (date: Date, days: number) =>
  isWithinInterval(date, {
    start: subDays(new Date(), days),
    end: new Date(),
  })
