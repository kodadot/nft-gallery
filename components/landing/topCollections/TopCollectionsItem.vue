<template>
  <nuxt-link :to="`/${urlPrefix}/collection/${collection.id}`">
    <div
      class="top-collections-item py-2 is-flex is-align-items-center is-justify-content-space-between is-clickable">
      <div class="is-flex is-align-items-center">
        <div class="p-4 has-text-weight-bold">
          {{ index }}
        </div>
        <div>
          <BasicImage
            custom-class="is-48x48 image-outline"
            rounded
            :src="collection.image || '/placeholder.webp'" />
        </div>
        <div class="px-2 is-flex is-flex-direction-column">
          <div class="has-text-weight-bold no-wrap">
            {{ collection.name | truncateStr(12) }}
          </div>
          <div class="is-flex is-justify-content-start">
            <div class="is-hidden-mobile">
              <div v-if="collection.floorPrice" class="no-wrap">
                {{ $t('general.floor') }}:
                <CommonTokenMoney
                  :value="collection.floorPrice"
                  inline
                  :round="2" />
              </div>
              <div v-else>---</div>
            </div>
            <div class="is-uppercase has-text-grey px-3 is-hidden-mobile">
              {{ chainName }}
            </div>
          </div>
          <div
            class="is-uppercase has-text-grey is-hidden-tablet is-size-7-mobile">
            {{ chainName }}
          </div>
        </div>
      </div>
      <div class="is-justify-content-end px-2 is-flex w-160">
        <div
          class="has-text-right is-flex-direction-column is-align-items-center is-flex is-size-7-mobile">
          <div class="no-wrap">
            <CommonTokenMoney :value="volume" inline :round="2" />
          </div>
          <div class="no-wrap is-hidden-mobile">
            <BasicMoney :value="usdValue" inline :unit="'USD'" :round="0" />
          </div>

          <div class="is-hidden-tablet is-size-7 no-wrap">
            <div v-if="diffPercentString" :class="color">
              {{ diffPercentString }}
            </div>
            <div v-else :class="color">--</div>
          </div>
        </div>
        <div
          v-if="diffPercentString"
          class="is-hidden-mobile is-justify-content-center is-align-items-center is-flex px-2">
          <div class="is-size-6 no-wrap" :class="color">
            {{ diffPercentString }}
          </div>
        </div>
      </div>
    </div>
  </nuxt-link>
</template>

<script lang="ts" setup>
import { TimeRange } from '@/components/series/types'
import { calculateUsdFromKsm } from '~~/utils/calculation'
import { CollectionEntityWithVolumes } from './utils/types'
import { getChainNameByPrefix } from '@/utils/chain'
const BasicImage = defineAsyncComponent(
  () => import('@/components/shared/view/BasicImage.vue')
)

const CommonTokenMoney = defineAsyncComponent(
  () => import('@/components/shared/CommonTokenMoney.vue')
)

const BasicMoney = defineAsyncComponent(
  () => import('@/components/shared/format/BasicMoney.vue')
)

const { urlPrefix } = usePrefix()
const { $store } = useNuxtApp()
const props = defineProps<{
  collection: CollectionEntityWithVolumes
  index: number
  timeRange?: TimeRange
}>()

const chainName = getChainNameByPrefix(urlPrefix.value)
const timeRange = computed(() => props.timeRange || 'Month')

const volume = computed(() => {
  switch (timeRange.value) {
    case 'All':
      return Number(props.collection.volume)
    case '3Month':
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
    case '3Month':
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
