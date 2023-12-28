import { formatToNow } from '@/utils/format/time'

const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const timeAgo = (timestamp: number): string => {
  const timeSince = formatToNow(timestamp)

  // Split the string into words, capitalize the first letter of each word, and join the words back together
  const capitalizedTimeSince = timeSince
    .split(' ')
    .map(capitalizeFirstLetter)
    .join(' ')

  return capitalizedTimeSince
}
