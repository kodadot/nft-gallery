<template>
  <div class="explore is-flex">
    <ExploreTabItem />
    <div class="explore-menu is-flex">
      <ExploreSort />
      <ExploreChain />
      <ExploreGrid class="is-hidden-mobile" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ExploreTabItem from './ExploreTabItem.vue'
import ExploreSort from './ExploreSort.vue'
import ExploreChain from './ExploreChain.vue'
import ExploreGrid from './ExploreGrid.vue'
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.explore {
  gap: 2rem;

  &-menu {
    gap: 2rem;
  }

  @include mobile {
    gap: 1rem;
    flex-direction: column;

    &-menu {
      gap: 1rem;
    }
  }
}
</style>
