<template>
  <div class="explore is-flex is-flex-wrap-wrap">
    <FilterMenuButton />
    <ExploreTabs />
    <div class="explore-menu is-flex">
      <ExploreSort />
      <ExploreOffer class="is-flex-grow-1" />
      <ExploreChain v-if="!route.name?.includes('prefix-collection-id')" />
      <ExploreGrid class="is-hidden-touch" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ExploreTabs from '../ExploreTabs.vue'
import ExploreSort from '../ExploreSort.vue'
import ExploreChain from '../ExploreChain.vue'
import ExploreGrid from '../ExploreGrid.vue'
import ExploreOffer from '../ExploreOffer.vue'
import FilterMenuButton from '../FilterMenuButton.vue'

const route = useRoute()
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';

.explore {
  gap: 1.5rem;

  &-menu {
    gap: 1.5rem;
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
