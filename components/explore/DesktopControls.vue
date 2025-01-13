<template>
  <div class="explore flex flex-wrap">
    <div class="flex content-center gap">
      <FilterMenuButton />
      <ExploreTabs />
    </div>

    <div
      v-if="isExploreCollections || isExploreItems || isCollection"
      class="explore-menu flex"
    >
      <ExploreSort />
      <ChainDropdown v-if="isExploreItems || isExploreCollections" />
      <GridLayoutControls v-if="isCollection || isExploreItems" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ExploreTabs from './ExploreTabs.vue'
import ExploreSort from './ExploreSort.vue'
import FilterMenuButton from './FilterMenuButton.vue'
import ChainDropdown from '@/components/common/ChainDropdown.vue'
import GridLayoutControls from '@/components/shared/GridLayoutControls.vue'

const route = useRoute()

const isCollection = computed(() => route.name === 'prefix-collection-id')
const isExploreItems = computed(() => route.name === 'prefix-explore-items')
const isExploreCollections = computed(() => route.name === 'prefix-explore-collectibles')
</script>

<style lang="scss" scoped>
.gap {
  gap: 1.5rem;
}
.explore {
  gap: 1.5rem;
  @apply bulma-mobile:gap-4 bulma-mobile:flex-col;

  &-menu {
    gap: 1.5rem;

    @apply bulma-mobile:gap-4;
  }

}
</style>
