import { formatDistanceToNow } from 'date-fns'

const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const timeAgo = (timestamp: number): string => {
  const { $i18n } = useNuxtApp()
  const timeSince = formatDistanceToNow(timestamp, {
    addSuffix: true,
    includeSeconds: true,
  })
  return `${capitalizeFirstLetter(timeSince)} ${$i18n.t('time.ago')}`
}
