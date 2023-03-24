export const timeAgo = (timestamp: number): string => {
  const { $i18n } = useNuxtApp()
  const { ago, second, seconds, minute, minutes, hour, hours, day, days } = {
    ago: $i18n.t('time.ago'),
    second: $i18n.t('time.second'),
    seconds: $i18n.t('time.seconds'),
    minute: $i18n.t('time.minute'),
    minutes: $i18n.t('time.minutes'),
    hour: $i18n.t('time.hour'),
    hours: $i18n.t('time.hours'),
    day: $i18n.t('time.day'),
    days: $i18n.t('time.days'),
  }
  const now = new Date().getTime()
  const secondsSince = Math.floor((now - timestamp) / 1000)
  if (secondsSince < 60) {
    return `${secondsSince} ${secondsSince !== 1 ? seconds : second} ${ago}`
  }
  const minutesSince = Math.floor(secondsSince / 60)
  if (minutesSince < 60) {
    return `${minutesSince} ${minutesSince !== 1 ? minutes : minute} ${ago}`
  }
  const hoursSince = Math.floor(minutesSince / 60)
  if (hoursSince < 24) {
    return `${hoursSince} ${hoursSince !== 1 ? hours : hour} ${ago}`
  }
  const daysSince = Math.floor(hoursSince / 24)
  return `${daysSince} ${daysSince !== 1 ? days : day} ${ago}`
}
