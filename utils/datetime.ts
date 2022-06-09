export function parseDate(ts: number): string {
  return new Date(ts).toLocaleString('en-GB', {
    timeZone: 'UTC',
    timeZoneName: 'short',
  })
}
