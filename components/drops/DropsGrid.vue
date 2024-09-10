<template>
  <DynamicGrid
    grid-size="medium"
    :default-width="GRID_DEFAULT_WIDTH"
    persist
  >
    <template
      v-if="isAsync || loaded"
    >
      <div
        v-for="(drop, index) in drops"
        :key="drop.collection"
        class="w-full h-full"
        :data-testid="index"
      >
        <slot
          name="card"
          :item="drop"
        >
          <DropCard :drop="drop" />
        </slot>
      </div>
    </template>
    <template v-if="!loaded">
      <DropsDropCardSkeleton
        v-for="x in isAsync ? asyncSkeletonCount : defaultSkeletonCount"
        :key="`${skeletonKey}-${x}`"
      />
    </template>
  </DynamicGrid>
</template>

<script lang="ts" setup>
import type { DropItem } from '@/params/types'
import DropCard from '@/components/drops/DropCard.vue'

const GRID_DEFAULT_WIDTH = {
  small: 0,
  medium: DROP_CARD_MIN_WIDTH,
  large: 0,
}

const props = defineProps<{
  drops: DropItem[]
  loaded: boolean
  defaultSkeletonCount: number
  asyncSkeletonCount?: number
  skeletonKey: string
  clickable?: boolean
}>()

const isAsync = computed(() => typeof props.asyncSkeletonCount === 'number')
</script>
