import type { TimeRange } from '@/components/series/types'
import type { CollectionEntityWithVolumes } from '@/components/landing/topCollections/utils/types'

export default (
  collection?: CollectionEntityWithVolumes,
  timeRange?: Ref<TimeRange>,
) => {
  const volume = computed(() => {
    if (!collection) {
      return 0
    }

    switch (timeRange?.value) {
      case 'All':
        return Number(collection.volume)
      case 'Quarter':
        return Number(collection.threeMonthVolume)
      case 'Month':
        return Number(collection.monthlyVolume)
      case 'Week':
        return Number(collection.weeklyVolume)
    }
  })

  const previousVolume = computed(() => {
    if (!collection) {
      return 0
    }

    switch (timeRange?.value) {
      case 'All':
        return 0
      case 'Quarter':
        return Number(collection.threeMonthlyrangeVolume)
      case 'Month':
        return Number(collection.monthlyrangeVolume)
      case 'Week':
        return Number(collection.weeklyrangeVolume)
    }
  })

  const diffPercent = computed(() => {
    if (!volume.value || !previousVolume.value) {
      return NaN
    }
    return (volume.value / previousVolume.value - 1) * 100
  })

  const sign = computed(() => {
    const intSign = Math.sign(diffPercent.value)
    if (isNaN(diffPercent.value) || intSign == 0) {
      return ''
    }
    return intSign == -1 ? '-' : '+'
  })

  const formattedDiffPercent = computed(() => {
    if (isNaN(diffPercent.value)) {
      return ''
    }
    return `${sign.value} ${Math.abs(Math.round(diffPercent.value))}%`
  })

  return { volume, diffPercent, formattedDiffPercent }
}
