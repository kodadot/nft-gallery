import { formatDuration, intervalToDuration, intlFormat } from 'date-fns'

export function toDropScheduledDurationString(startTime: Date) {
  const duration = intervalToDuration({
    start: startTime,
    end: new Date(),
  })
  return formatDuration(duration, {
    format: ['hours', 'minutes'],
  })
}

export function formatDropStartTime(
  startTime: Date,
  locale: string,
  withTime = false,
) {
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
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

export const fromatCETDate = (date: string, time: string = ''): Date => {
  const t = time ? `T${time}` : ''
  return new Date(`${date}${t}+01:00`)
}
