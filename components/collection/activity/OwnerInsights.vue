<template>
  <div class="fixed-height border">
    <div class="py-4 px-5 is-flex border-bottom" aria-label="controls">
      <div
        class="mr-4 is-clickable"
        :class="{ 'has-text-weight-bold': activeTab === Tabs.holders }"
        @click="activeTab = Tabs.holders">
        {{ $t('holders') }}
      </div>
      <div
        class="is-clickable"
        :class="{ 'has-text-weight-bold': activeTab === Tabs.flippers }"
        @click="activeTab = Tabs.flippers">
        {{ $t('flippers') }}
      </div>
    </div>
    <div class="py-4 px-5 limit-height is-scrollable">
      <HoldersTab v-if="activeTab === Tabs.holders" :owners="owners" />
      <FlippersTab v-if="activeTab === Tabs.flippers" :flippers="flippers" />
    </div>
  </div>
</template>

<script setup lang="ts">
import HoldersTab from './holdersFlippersTabs/HolderTab.vue'
import FlippersTab from './holdersFlippersTabs/FlipperTab.vue'
import { Flippers, Owners } from '@/components/collection/utils/types'

enum Tabs {
  holders,
  flippers,
}

defineProps<{
  owners?: Owners
  flippers?: Flippers
}>()
const activeTab = ref(Tabs.holders)
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
