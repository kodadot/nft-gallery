<template>
  <div>
    <div class="flex justify-between max-md:flex-col pb-9 md:pb-10">
      <div class="text-[2.5rem] font-semibold leading-[1.125] max-md:mb-6">
        {{ $t('general.topCollectionsHeading') }}
      </div>
      <div
        class="flex items-start justify-start flex-wrap pt-2 [&>.control:not(:last-of-type)]:border-r-0 [&>.control:not(:last-of-type)]:mb-2">
        <NeoButton
          v-for="{ value, label } in timeRanges"
          :key="value"
          class="control column p-0 min-w-[70px] max-md:w-full md:min-w-[98px] px-4 mobile-padding"
          :active="state.timeRange === value"
          :label="`${$t(`topCollections.timeFrames.${label}`)}`"
          @click="setTimeRange(value)" />
      </div>
      <div class="!pt-4 md:!pt-2">
        <ChainDropdown
          position="bottom-auto"
          :show-network-label="false"
          :redirect="false"
          :exclude="['ksm']" />
      </div>
    </div>

    <LandingTopCollectionsGrid
      :collections="data"
      :time-range="state.timeRange"
      :loading="loading"
      :skeleton-count="limit" />
  </div>
</template>

<script lang="ts" setup>
import { TimeRange, TimeRangeOption } from '@/components/series/types'
import { NeoButton } from '@kodadot1/brick'
import { useTopCollections } from './utils/useTopCollections'
import { useFiatStore } from '@/stores/fiat'

const fiatStore = useFiatStore()

const limit = 12
const { data, loading } = useTopCollections(limit)

const state = reactive<{ timeRange: TimeRange }>({ timeRange: 'Month' })

const timeRanges: TimeRangeOption[] = [
  { value: 'Week', label: 'week' },
  { value: 'Month', label: 'month' },
  { value: 'Quarter', label: 'quarter' },
  { value: 'All', label: 'all' },
]

const setTimeRange = (timeRange: TimeRange) => {
  state.timeRange = timeRange
}

onMounted(() => {
  if (fiatStore.getCurrentKSMValue) {
    fiatStore.fetchFiatPrice()
  }
})
</script>
