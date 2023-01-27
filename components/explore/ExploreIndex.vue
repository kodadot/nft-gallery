<template>
  <div class="explore is-flex">
    <ExploreTabs />
    <ExploreSort v-if="route.path.includes('items')" />
  </div>
</template>

<script setup lang="ts" scoped>
import ExploreTabs from './ExploreTabs.vue'
import ExploreSort from './ExploreSort.vue'

const route = useRoute()
</script>

<style lang="scss" scoped>
.explore {
  gap: 2rem;
}
</style>
