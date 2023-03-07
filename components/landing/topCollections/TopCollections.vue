<template>
  <div>
    <div class="is-flex is-justify-content-space-between mobile">
      <div class="title is-2">{{ $t('general.topCollectionsHeading') }}</div>
      <div
        class="top-collection-controls buttons is-align-items-flex-start pt-2">
        <NeoButton
          v-for="{ value, label } in timeRanges"
          :key="value"
          class="control column p-0 has-fixed-width px-4 mobile-padding"
          :active="state.timeRange === value"
          :label="`${$t(`topCollections.timeFrames.${label}`)}`"
          @click.native="setTimeRange(value)" />
      </div>
      <div></div>
    </div>

    <div class="top-collections-grid mb-5">
      <div v-for="(collection, index) in data" :key="index">
        <TopCollectionsItem
          :collection="collection"
          :index="index + 1"
          :time-range="state.timeRange" />
      </div>
    </div>

    <div v-if="loading" class="top-collections-grid">
      <div
        v-for="index in limit"
        :key="index"
        class="top-collections-item py-2 is-flex is-align-items-center is-justify-content-space-between">
        <div class="is-flex is-align-items-center">
          <div class="p-4 has-text-weight-bold">
            {{ index }}
          </div>
          <div>
            <BasicImage custom-class="is-48x48 image-outline" rounded />
          </div>
        </div>
        <div class="px-2" style="width: 60%">
          <b-skeleton width="70%" />
          <b-skeleton width="20%" size="is-small" />
        </div>
        <div class="is-pulled-right has-text-right px-4" style="width: 20%">
          <b-skeleton width="80%" position="is-right" />
          <b-skeleton width="70%" size="is-small" position="is-right" />
        </div>
      </div>
    </div>

    <nuxt-link
      v-show="urlPrefix === 'rmrk' || urlPrefix === 'bsx'"
      to="/series-insight"
      class="link">
      {{ $t('helper.seeMore') }} >
    </nuxt-link>
  </div>
</template>

<script lang="ts" setup>
import { TimeRange, TimeRangeOption } from '@/components/series/types'
import BasicImage from '@/components/shared/view/BasicImage.vue'

import { NeoButton } from '@kodadot1/brick'
import TopCollectionsItem from './TopCollectionsItem.vue'
import { useTopCollections } from './utils/useTopCollections'
import { useFiatStore } from '@/stores/fiat'

const { urlPrefix } = usePrefix()
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
