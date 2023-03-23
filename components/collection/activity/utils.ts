export const timeAgo = (timestamp: number): string => {
  const now = new Date().getTime()
  const secondsSince = Math.floor((now - timestamp) / 1000)
  if (secondsSince < 60) {
    return `${secondsSince} Second${secondsSince !== 1 ? 's' : ''} Ago`
  }
  const minutesSince = Math.floor(secondsSince / 60)
  if (minutesSince < 60) {
    return `${minutesSince} Minute${minutesSince !== 1 ? 's' : ''} Ago`
  }
  const hoursSince = Math.floor(minutesSince / 60)
  if (hoursSince < 24) {
    return `${hoursSince} Hour${hoursSince !== 1 ? 's' : ''} Ago`
  }
  const daysSince = Math.floor(hoursSince / 24)
  return `${daysSince} Day${daysSince !== 1 ? 's' : ''} Ago`
}
