import { formatDuration, intervalToDuration, intlFormat } from 'date-fns'

export function toDropScheduledDurationString(startTime: Date, short: boolean = false) {
  const duration = intervalToDuration({
    start: startTime,
    end: new Date(),
  })

  const options = {
    format: ['hours', 'minutes'],
  }

  if (short) {
    Object.assign(options, {
      locale: {
        formatDistance: (token: string, count: string) => {
          return {
            xHours: '{{count}}h',
            xMinutes: '{{count}}m',
            xSeconds: '{{count}}s',
          }?.[token]?.replace('{{count}}', count)
        },
      } as Locale,
    })
  }

  return formatDuration(duration, options)
}

export function formatDropStartTime(
  startTime: Date,
  locale: string,
  withTime = false,
) {
  const options = {
    day: '2-digit',
    month: withTime ? '2-digit' : 'long',
    hour12: withTime,
  } as const

  if (withTime) {
    Object.assign(options, {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return intlFormat(startTime, options, { locale })
}

export const formatCETDate = (date: string, time: string): Date =>
  new Date(`${date}T${time}+02:00`)

export const parseCETDate = (datetime: string): Date => {
  const [date, time] = datetime.split(' ')
  return formatCETDate(date, time)
}

export const dateHasTime = (datetime: string): boolean => /:/.test(datetime)
