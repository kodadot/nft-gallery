<template>
  <div class="explore is-flex">
    <ExploreTabs />
    <ExploreSort />
  </div>
</template>

<script setup lang="ts" scoped>
import ExploreTabs from './ExploreTabs.vue'
import ExploreSort from './ExploreSort.vue'
</script>

<style lang="scss" scoped>
.explore {
  gap: 1rem;
}
</style>
