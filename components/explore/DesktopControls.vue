<template>
  <div class="explore flex flex-wrap">
    <div class="flex content-center gap">
      <FilterMenuButton />
      <ExploreTabs />
    </div>

    <div v-if="!isActivityTab" class="explore-menu flex">
      <ExploreSort />
      <ChainDropdown
        v-if="!route.name?.toString().includes('prefix-collection-id')" />
      <GridLayoutControls v-if="!isCollection" />
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

const isCollection = computed(() =>
  route.name?.toString().includes('prefix-explore-collectibles'),
)
const isActivityTab = computed(() =>
  route.name?.toString().includes('prefix-collection-id-activity'),
)
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.gap {
  gap: 1.5rem;
}
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
