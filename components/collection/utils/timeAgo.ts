import { formatDistanceToNow } from 'date-fns'

const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const timeAgo = (timestamp: number): string => {
  const timeSince = formatDistanceToNow(timestamp, {
    addSuffix: true,
    includeSeconds: true,
  })

  // Split the string into words, capitalize the first letter of each word, and join the words back together
  const capitalizedTimeSince = timeSince
    .split(' ')
    .map(capitalizeFirstLetter)
    .join(' ')

  return capitalizedTimeSince
}
