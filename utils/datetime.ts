export function parseDate(ts: number | Date): string {
  return new Date(ts).toLocaleString('en-GB', {
    timeZone: 'UTC',
    timeZoneName: 'short',
  })
}
