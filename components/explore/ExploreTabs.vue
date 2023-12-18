<template>
  <div class="has-addons flex items-center" data-testid="gallery-explore-tabs">
    <TabOnCollection v-if="route.name?.includes('prefix-collection-id')" />
    <TabOnExplore v-else />
  </div>
</template>

<script setup lang="ts">
import TabOnExplore from './tab/TabOnExplore.vue'
import TabOnCollection from './tab/TabOnCollection.vue'

const route = useRoute()
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

@include mobile {
  .mobile-expand {
    width: 100%;
  }
}
</style>
