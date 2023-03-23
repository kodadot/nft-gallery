<template>
  <div class="fixed-height border">
    <div class="py-4 px-5 is-flex border-bottom" aria-label="controls">
      <div
        class="mr-4 is-clickable"
        :class="{ 'has-text-weight-bold': activeTab === Tabs.Holders }"
        @click="activeTab = Tabs.Holders">
        {{ $t('holders') }}
      </div>
      <div
        class="is-clickable"
        :class="{ 'has-text-weight-bold': activeTab === Tabs.Flippers }"
        @click="activeTab = Tabs.Flippers">
        {{ $t('flippers') }}
      </div>
    </div>
    <div class="py-4 px-5 limit-height is-scrollable">
      <HoldersTab v-if="activeTab === Tabs.Holders" :owners="owners" />
      <FlippersTab v-if="activeTab === Tabs.Flippers" :flippers="flippers" />
    </div>
  </div>
</template>

<script setup lang="ts">
import HoldersTab from './holdersFlippersTabs/HolderTab.vue'
import FlippersTab from './holdersFlippersTabs/FlipperTab.vue'
import { Flippers, Owners } from '../utils/useCollectionDetails'

enum Tabs {
  Holders,
  Flippers,
}

defineProps<{
  owners?: Owners
  flippers?: Flippers
}>()
const activeTab = ref(Tabs.Holders)
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

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
