<template>
  <div
    class="explore flex flex-wrap"
    :class="{ 'has-gap': !isActivityTab }"
  >
    <ExploreTabs />
    <div class="explore-menu flex flex-wrap">
      <FilterFloatButton v-if="isActivityTab" />
      <FilterMenuButton v-else />
      <ChainDropdown
        v-if="!isCollectionTab && !isSwapsTab"
        class="flex-grow-1"
      />
      <ExploreSort v-if="!isActivityTab && !isSwapsTab" />
    </div>
  </div>
</template>

<script setup lang="ts">
import ExploreTabs from './ExploreTabs.vue'
import ExploreSort from './ExploreSort.vue'
import FilterMenuButton from './FilterMenuButton.vue'
import FilterFloatButton from '@/components/collection/activity/FilterFloatButton.vue'
import ChainDropdown from '@/components/common/ChainDropdown.vue'

const route = useRoute()
const routeName = computed(() => route.name?.toString() || '')

const isCollectionTab = computed(() => routeName.value.includes('prefix-collection-id'))
const isActivityTab = computed(() => routeName.value.includes('prefix-collection-id-activity'))
const isSwapsTab = computed(() => routeName.value.includes('prefix-collection-id-swaps'))
</script>

<style lang="scss" scoped>
.explore {
  @apply bulma-mobile:flex-col;

  &.has-gap {
    gap: 1.5rem;
    @apply bulma-mobile:gap-4;
  }

  &-menu {
    gap: 1.5rem;
    @apply bulma-mobile:gap-4;
  }
}
</style>
