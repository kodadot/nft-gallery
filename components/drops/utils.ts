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

export function formatDropStartTime(startTime: Date, locale: string) {
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour12: false,
  } as const
  return intlFormat(startTime, options, { locale })
}
