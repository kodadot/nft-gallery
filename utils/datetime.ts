import { isWithinInterval, subDays, formatDistanceToNow as dfnsFormatDistanceToNow } from 'date-fns'
import { enUS } from 'date-fns/locale'

export function parseDate(ts: number | Date): string {
  return new Date(ts).toLocaleString()
}

export const isDateWithinLastDays = (date: Date, days: number) =>
  isWithinInterval(date, {
    start: subDays(new Date(), days),
    end: new Date(),
  })

export const formatDistanceToNow = (date: string) => {
  return dfnsFormatDistanceToNow(new Date(date), {
    addSuffix: false,
    locale: {
      ...enUS,
      formatDistance: (token, count) => {
        const formats = {
          xSeconds: count => `${count}s`,
          xMinutes: count => `${count}m`,
          xHours: count => `${count}h`,
          xDays: count => `${count}d`,
          lessThanXSeconds: count => `<${count}s`,
          lessThanXMinutes: count => `<${count}m`,
          aboutXHours: count => `${count}h`,
        }

        return formats[token](count)
      },
    },
  })
}
