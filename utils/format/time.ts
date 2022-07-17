import { intervalToDuration, formatDuration, addSeconds } from 'date-fns'

export const formatSecondsToDuration = (seconds: number) => {
  const duration = intervalToDuration({
    start: new Date(),
    end: addSeconds(new Date(), seconds),
  })
  return formatDuration(duration)
}
