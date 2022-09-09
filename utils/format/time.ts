import {
  addSeconds,
  formatDistanceToNow,
  formatDuration,
  intervalToDuration,
} from 'date-fns'
import { parseDate } from '../datetime'

export const formatSecondsToDuration = (seconds: number) => {
  const duration = intervalToDuration({
    start: new Date(),
    end: addSeconds(new Date(), seconds),
  })
  let format
  if (Number(duration.years) > 0) {
    format = ['years']
  } else if (Number(duration.months) > 0) {
    format = ['months']
  } else if (Number(duration.days) > 0) {
    format = ['days']
  } else if (Number(duration.hours) > 0) {
    format = ['hours']
  } else if (Number(duration.minutes) > 0) {
    format = ['minutes']
  } else {
    format = ['seconds']
  }

  return formatDuration(duration, {
    format,
  })
}

export const endDate = (seconds: number): string => {
  return parseDate(addSeconds(new Date(), seconds))
}

export const formatToNow = (date: Date): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}
