<template>
  <div>
    <div class="flex justify-between mobile">
      <div class="title is-2">{{ $t('general.topCollectionsHeading') }}</div>
      <div class="top-collection-controls buttons items-start pt-2">
        <NeoButton
          v-for="{ value, label } in timeRanges"
          :key="value"
          class="control column p-0 has-fixed-width px-4 mobile-padding"
          :active="state.timeRange === value"
          :label="`${$t(`topCollections.timeFrames.${label}`)}`"
          @click="setTimeRange(value)" />
      </div>
      <div class="pt-2">
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
      class="mt-5 md:mt-0"
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

const state = reactive<{ timeRange: TimeRange }>({ timeRange: 'All' })

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
