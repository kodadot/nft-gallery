<template>
  <div>
    <div class="is-flex is-justify-content-space-between mobile">
      <div class="title is-2">{{ $t('general.topCollectionsHeading') }}</div>
      <div
        class="is-flex buttons is-flex-wrap-nowrap is-align-items-flex-start pt-2">
        <div class="control column p-0">
          <NeoButton
            class="has-fixed-width px-4 mobile-padding"
            :active="state.timeRange == 'Week'"
            label="7 Days"
            @click.native="setTimeRange('Week')" />
        </div>
        <div class="control column p-0">
          <NeoButton
            class="has-fixed-width px-4 mobile-padding"
            :active="state.timeRange == 'Month'"
            label="30 Days"
            @click.native="setTimeRange('Month')" />
        </div>
        <div class="control column p-0">
          <NeoButton
            class="has-fixed-width px-4 mobile-padding"
            :active="state.timeRange == '3Month'"
            label="90 Days"
            @click.native="setTimeRange('3Month')" />
        </div>
        <div class="control column p-0">
          <NeoButton
            class="has-fixed-width px-4 mobile-padding"
            :active="state.timeRange == 'All'"
            label="All"
            @click.native="setTimeRange('All')" />
        </div>
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
          <div class="px-2">
            <div>
              <b-skeleton width="170px"></b-skeleton>
            </div>
            <div>
              <b-skeleton width="140px" size="is-small"></b-skeleton>
            </div>
          </div>
        </div>
        <div class="is-pulled-right has-text-right px-4">
          <div>
            <b-skeleton width="120px"></b-skeleton>
          </div>
          <div>
            <b-skeleton
              width="70%"
              size="is-small"
              position="is-right"></b-skeleton>
          </div>
        </div>
      </div>
    </div>

    <nuxt-link v-show="urlPrefix === 'rmrk'" to="/series-insight" class="link">
      {{ $t('helper.seeMore') }} >
    </nuxt-link>
  </div>
</template>

<script lang="ts" setup>
import { TimeRange } from '@/components/series/types'
import BasicImage from '@/components/shared/view/BasicImage.vue'

import { NeoButton } from '@kodadot1/brick'
import TopCollectionsItem from './TopCollectionsItem.vue'
import { useTopCollections } from './utils/useTopCollections'
const { urlPrefix } = usePrefix()
const { $store } = useNuxtApp()

const limit = 12
const { data, loading } = useTopCollections(limit)

const state = reactive<{ timeRange: TimeRange }>({ timeRange: 'All' })

const setTimeRange = (timeRange: TimeRange) => {
  state.timeRange = timeRange
}

onMounted(() => {
  if ($store.getters['getCurrentKSMValue']) {
    $store.dispatch('fiat/fetchFiatPrice')
  }
})
</script>
