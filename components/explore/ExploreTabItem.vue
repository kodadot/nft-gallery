<template>
  <div class="field has-addons is-flex is-align-items-center" data-cy="tabs">
    <ExploreSidebarToggle v-if="!isMobileDevice" class="mr-4" />
    <TabOnCollection v-if="route.name?.includes('prefix-collection-id')" />
    <TabOnExplore v-else />
  </div>
</template>

<script setup lang="ts">
import TabOnExplore from './tab/TabOnExplore.vue'
import TabOnCollection from './tab/TabOnCollection.vue'
import ExploreSidebarToggle from './ExploreSidebarToggle.vue'
import { isMobileDevice } from '@/utils/extension'

const route = useRoute()
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';
a.disabled {
  opacity: 0.3;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
