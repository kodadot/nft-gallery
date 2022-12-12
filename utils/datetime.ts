import { format } from 'date-fns'

export function parseDate(ts: number | Date): string {
  return format(new Date(ts), 'HH:mm | dd.MM.yyyy')
}
