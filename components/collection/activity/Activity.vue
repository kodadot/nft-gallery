<template>
  <div class="is-flex is-align-self-flex-start">
    <SidebarFilter />
    <div class="w-full mt-5">
      <div class="columns">
        <div class="column is-two-thirds-desktop is-half-tablet">
          <ActivityChart :events="events" />
        </div>
        <div class="column">
          <OwnerInsights :owners="owners" :flippers="flippers" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SidebarFilter from '@/components/explore/SidebarFilter.vue'
import ActivityChart from './Chart.vue'
import OwnerInsights from './OwnerInsights.vue'

import { useCollectionActivity } from '@/components/collection/utils/useCollectionDetails'
const route = useRoute()

const collectionId = computed(() => route.params.id)
const { events, flippers, owners } = useCollectionActivity({
  collectionId: collectionId.value,
})
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';
</style>
