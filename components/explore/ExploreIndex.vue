<template>
  <div class="explore is-flex">
    <ExploreTabItem />
    <ExploreSort />
  </div>
</template>

<script setup lang="ts" scoped>
import ExploreTabItem from './ExploreTabItem.vue'
import ExploreSort from './ExploreSort.vue'
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.explore {
  margin-bottom: 2.5rem;
  gap: 2rem;

  @include mobile {
    gap: 1rem;
    flex-direction: column;
  }
}
</style>
