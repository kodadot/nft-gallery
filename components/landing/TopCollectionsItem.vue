<template>
  <nuxt-link :to="`/${urlPrefix}/collection/${collection.id}`">
    <div
      class="top-collections-item py-2 is-flex is-align-items-center is-justify-content-space-between is-clickable">
      <div class="is-flex is-align-items-center is-flex-grow-1">
        <div class="p-4 has-text-weight-bold">
          {{ index }}
        </div>
        <div>
          <BasicImage
            custom-class="is-48x48 image-outline"
            rounded
            :src="collection.image || '/placeholder.webp'" />
        </div>
        <div class="px-2 is-flex is-flex-grow-1 is-flex-direction-column">
          <div class="has-text-weight-bold">
            {{ collection.name | truncateStr(12) }}
          </div>
          <div class="is-flex is-justify-content-space-between nowrap">
            <div>
              <div v-if="collection.floorPrice">
                Floor:
                <CommonTokenMoney :value="collection.floorPrice" inline />
              </div>
              <div v-else>---</div>
            </div>
            <div class="is-uppercase has-text-grey pl-2">
              {{ urlPrefix }}
            </div>
          </div>
        </div>
      </div>
      <div class="is-pulled-right has-text-right px-2">
        <div class="is-flex">
          <div>
            <div class="nowrap">
              <CommonTokenMoney :value="volume" inline />
            </div>
            <div class="nowrap">
              <BasicMoney :value="usdValue" inline :unit="'USD'" />
            </div>
          </div>
          <div
            v-if="diffPercentString"
            class="is-flex is-justify-content-center is-align-items-center pl-2 is-size-6" :class="color">
            {{ diffPercentString }}
          </div>
        </div>
      </div>
    </div>
  </nuxt-link>
</template>

<script lang="ts" setup>
import { RowSeries } from '@/components/series/types'
import { calculateUsdFromKsm } from '~~/utils/calculation'

const BasicImage = defineAsyncComponent(
  () => import('@/components/shared/view/BasicImage.vue')
)

const CommonTokenMoney = defineAsyncComponent(
  () => import('@/components/shared/CommonTokenMoney.vue')
)

const BasicMoney = defineAsyncComponent(
  () => import('@/components/shared/format/BasicMoney.vue')
)

type TimeRange = 'All' | 'Month' | 'Week' | 'Day'

const { urlPrefix } = usePrefix()
const { $store } = useNuxtApp()
const props = defineProps<{
  collection: RowSeries
  index: number
  timeRange?: TimeRange
}>()

const timeRange = computed(() => props.timeRange || 'Month')

const volume = computed(() => {
  switch (timeRange.value) {
    case 'All':
      return Number(props.collection.volume)
    case 'Month':
      return Number(props.collection.monthlyVolume)
    case 'Week':
      return Number(props.collection.weeklyVolume)
    case 'Day':
      return Number(props.collection.dailyVolume)
  }
})

const previousVolume = computed(() => {
  switch (timeRange.value) {
    case 'All':
      return 0
    case 'Month':
      return Number(props.collection.monthlyrangeVolume)
    case 'Week':
      return Number(props.collection.weeklyrangeVolume)
    case 'Day':
      return Number(props.collection.dailyrangeVolume)
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

const usdValue = computed(() =>
  calculateUsdFromKsm(volume.value, $store.getters['fiat/getCurrentKSMValue'])
)

const color = computed(() => {
  if (diffPercent.value) {
    return diffPercent.value < 0 ? 'has-text-danger' : 'has-text-success'
  }
  return undefined
})
</script>
<style scoped>
.nowrap {
  white-space: nowrap;
}
</style>
