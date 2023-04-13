<template>
  <div class="fixed-height border">
    <div class="py-4 px-5 is-flex border-bottom" aria-label="controls">
      <div
        class="mr-4 is-clickable"
        :class="{ 'has-text-weight-bold': activeTab === Tabs.holders }"
        @click="changeTab(Tabs.holders)">
        {{ $t('holders') }}
      </div>
      <div
        class="is-clickable"
        :class="{ 'has-text-weight-bold': activeTab === Tabs.flippers }"
        @click="changeTab(Tabs.flippers)">
        {{ $t('flippers') }}
      </div>
    </div>
    <div ref="container" class="py-4 limit-height is-scrollable">
      <HoldersTab v-if="activeTab === Tabs.holders" :owners="owners" />
      <FlippersTab v-if="activeTab === Tabs.flippers" :flippers="flippers" />
    </div>
  </div>
</template>

<script setup lang="ts">
import HoldersTab from './ownerInsightsTabs/HolderTab.vue'
import FlippersTab from './ownerInsightsTabs/FlipperTab.vue'
import { Flippers, Owners } from '@/composables/collectionActivity/types'

enum Tabs {
  holders,
  flippers,
}

defineProps<{
  owners?: Owners
  flippers?: Flippers
}>()
const activeTab = ref(Tabs.holders)
const container = ref<HTMLDivElement | null>(null)

const scrollPositions = {
  [Tabs.holders]: 0,
  [Tabs.flippers]: 0,
}

const changeTab = (tab: Tabs) => {
  // Store the current scroll position
  if (container.value) {
    scrollPositions[activeTab.value] = container.value.scrollTop
  }
  // Set the new active tab and restore the previous scroll position
  // this is done in order to optimize performance and prevent unnecessary loading
  // since HolderTab and FlippersTab are lazy loaded
  activeTab.value = tab
  if (container.value) {
    container.value.scrollTop = scrollPositions[tab]
  }
}
</script>

<style lang="scss" scoped>
.fixed-height {
  height: 350px;
}
.limit-height {
  max-height: 290px;
}
.is-scrollable {
  overflow-y: auto;
}
</style>
