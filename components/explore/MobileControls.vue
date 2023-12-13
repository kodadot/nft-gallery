<template>
  <div class="explore flex flex-wrap" :class="{ 'has-gap': !isActivityTab }">
    <ExploreTabs />
    <div class="explore-menu flex flex-wrap">
      <FilterFloatButton v-if="isActivityTab" />
      <FilterMenuButton v-else />
      <ExploreOffer v-if="!isActivityTab" class="flex-grow" />
      <ChainDropdown
        v-if="!route.name?.includes('prefix-collection-id')"
        class="flex-grow-1" />
      <ExploreSort v-if="!isActivityTab" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ExploreTabs from './ExploreTabs.vue'
import ExploreSort from './ExploreSort.vue'
import ExploreOffer from './ExploreOffer.vue'
import FilterMenuButton from './FilterMenuButton.vue'
import FilterFloatButton from '@/components/collection/activity/FilterFloatButton.vue'
import ChainDropdown from '@/components/common/ChainDropdown.vue'

const route = useRoute()

const isActivityTab = computed(
  () => route.name?.includes('prefix-collection-id-activity'),
)
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.explore {
  &.has-gap {
    gap: 1.5rem;
  }

  &-menu {
    gap: 1.5rem;
  }

  @include mobile {
    flex-direction: column;

    &.has-gap {
      gap: 1rem;
    }

    &-menu {
      gap: 1rem;
    }
  }
}
</style>
