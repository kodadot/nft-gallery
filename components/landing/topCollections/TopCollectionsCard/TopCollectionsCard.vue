<template>
  <div
    class="top-collection-card w-full border border-card-border-color hover:border-border-color bg-background-color">
    <nuxt-link
      class="flex flex-col hover:text-text-color"
      rel="nofollow noopener noreferrer"
      :to="`/${urlPrefix}/collection/${collection.id}`">
      <div
        class="top-collection-card-banner"
        :style="{ backgroundImage: `url(${collection.image})` }">
        <div class="top-collection-card-banner-avatar-container">
          <BasicImage
            custom-class="top-collection-card-banner-avatar-inner [&>img]:border [&>img]:border-card-border-color !p-0"
            :src="collection.image || placeholder" />
        </div>
      </div>

      <div class="top-collection-card-info border-t border-card-border-color">
        <p
          class="collection-name font-bold text-base whitespace-nowrap text-center truncate">
          {{ collection.name }}
        </p>

        <div class="info-fields">
          <div v-if="collection.floorPrice || collection.floor">
            <p class="capitalize text-k-grey text-xs">
              {{ $t('price') }}
            </p>

            <div class="flex gap-2 items-center">
              <CommonTokenMoney
                :value="collection.floorPrice || collection.floor"
                inline
                :round="2" />

              <div v-if="diffPercentString" :class="color" class="text-xs">
                {{ diffPercentString }}
              </div>
            </div>
          </div>

          <div>
            <p class="capitalize text-k-grey text-end text-xs">
              {{ $t('volume') }}
            </p>
            <div class="flex gap-2 items-center">
              <CommonTokenMoney :value="volume" inline :round="1" />
            </div>
          </div>
        </div>
      </div>
    </nuxt-link>
  </div>
</template>

<script setup lang="ts">
import { TimeRange } from '~/components/series/types'
import { CollectionEntityWithVolumes } from '../utils/types'

const props = defineProps<{
  collection: CollectionEntityWithVolumes
  timeRange?: TimeRange
}>()

const { placeholder } = useTheme()
const { urlPrefix } = usePrefix()

const timeRange = computed(() => props.timeRange || 'Month')

const volume = computed(() => {
  switch (timeRange.value) {
    case 'All':
      return Number(props.collection.volume)
    case 'Quarter':
      return Number(props.collection.threeMonthVolume)
    case 'Month':
      return Number(props.collection.monthlyVolume)
    case 'Week':
      return Number(props.collection.weeklyVolume)
  }
})

const previousVolume = computed(() => {
  switch (timeRange.value) {
    case 'All':
      return 0
    case 'Quarter':
      return Number(props.collection.threeMonthlyrangeVolume)
    case 'Month':
      return Number(props.collection.monthlyrangeVolume)
    case 'Week':
      return Number(props.collection.weeklyrangeVolume)
  }
})

const diffPercent = computed(() => {
  if (volume.value === 0 || previousVolume.value === 0) {
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
const diffPercentString = computed(() => {
  if (isNaN(diffPercent.value)) {
    return ''
  }
  return `${sign.value} ${Math.abs(Math.round(diffPercent.value))}%`
})

const color = computed(() => {
  if (diffPercent.value) {
    return diffPercent.value < 0 ? 'text-k-red' : 'text-k-green'
  }
  return undefined
})
</script>

<style lang="scss" scoped>
@import './TopCollectionsCard.scss';
</style>
