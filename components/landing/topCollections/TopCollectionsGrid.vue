<template>
  <DynamicGrid grid-size="medium" :default-width="GRID_DEFAULT_WIDTH">
    <template v-if="loading">
      <LandingTopCollectionsTopCollectionsCardSkeleton
        v-for="skeleton in skeletonCount"
        :key="`top-collection-skeleton-card-${skeleton}`" />
    </template>

    <template v-else>
      <div
        v-for="(collection, index) in collections"
        :key="collection.id"
        :data-testid="`top-collection-index-${index}`">
        <LandingTopCollectionsTopCollectionsCard
          :collection="collection"
          :time-range="timeRange" />
      </div>
    </template>
  </DynamicGrid>
</template>

<script setup lang="ts">
import { TimeRange } from '@/components/series/types'
import { CollectionEntityWithVolumes } from './utils/types'

const GRID_DEFAULT_WIDTH = {
  small: 0,
  medium: 16 * 21,
  large: 0,
}

defineProps<{
  collections: CollectionEntityWithVolumes[]
  timeRange: TimeRange
  loading: boolean
  skeletonCount: number
}>()
</script>
