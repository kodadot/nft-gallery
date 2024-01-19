<template>
  <nuxt-link :to="`/${urlPrefix}/collection/${collection.id}`">
    <div
      class="top-collections-item py-2 flex items-center justify-between cursor-pointer">
      <div class="flex items-center">
        <div class="p-4 has-text-weight-bold">
          {{ index }}
        </div>
        <div>
          <BasicImage
            custom-class="is-48x48 image-outline"
            rounded
            :src="collection.image || placeholder" />
        </div>
        <div class="px-2 flex flex-col">
          <div class="has-text-weight-bold whitespace-nowrap">
            {{ truncateStr(collection.name, 12) }}
          </div>
          <div class="flex justify-start">
            <div class="is-hidden-mobile">
              <div
                v-if="collection.floorPrice || collection.floor"
                class="whitespace-nowrap">
                {{ $t('general.floor') }}:
                <CommonTokenMoney
                  :value="collection.floorPrice || collection.floor"
                  inline
                  :round="2" />
              </div>
              <div v-else>---</div>
            </div>
            <div class="capitalize text-k-grey px-3 is-hidden-mobile">
              {{ chainName }}
            </div>
          </div>
          <div class="capitalize text-k-grey is-hidden-tablet text-xs-mobile">
            {{ chainName }}
          </div>
        </div>
      </div>
      <div class="justify-end px-2 flex w-160">
        <div class="text-right flex-col items-center flex text-xs-mobile">
          <div class="whitespace-nowrap">
            <CommonTokenMoney :value="volume" inline :round="1" />
          </div>
          <div class="whitespace-nowrap is-hidden-mobile">
            <BasicMoney
              :value="usdValue"
              inline
              hide-unit
              :round="0" />&nbsp;USD
          </div>

          <div class="is-hidden-tablet text-xs whitespace-nowrap">
            <div v-if="diffPercentString" :class="color">
              {{ diffPercentString }}
            </div>
            <div v-else :class="color">--</div>
          </div>
        </div>
        <div
          v-if="diffPercentString"
          class="is-hidden-mobile justify-center items-center flex px-2">
          <div class="is-size-6 whitespace-nowrap" :class="color">
            {{ diffPercentString }}
          </div>
        </div>
      </div>
    </div>
  </nuxt-link>
</template>

<script lang="ts" setup>
import { TimeRange } from '@/components/series/types'
import { CollectionEntityWithVolumes } from './utils/types'
import { getChainNameByPrefix } from '@/utils/chain'

const BasicImage = defineAsyncComponent(
  () => import('@/components/shared/view/BasicImage.vue'),
)

const CommonTokenMoney = defineAsyncComponent(
  () => import('@/components/shared/CommonTokenMoney.vue'),
)

const BasicMoney = defineAsyncComponent(
  () => import('@/components/shared/format/BasicMoney.vue'),
)

const { urlPrefix } = usePrefix()
const { placeholder } = useTheme()
const { toUsdPrice } = useUsdValue()
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

const usdValue = computed(() => toUsdPrice(volume.value, chainName))

const color = computed(() => {
  if (diffPercent.value) {
    return diffPercent.value < 0 ? 'has-text-danger' : 'has-text-success'
  }
  return undefined
})
</script>
