<template>
  <DynamicGrid
    grid-size="medium"
    :default-width="GRID_DEFAULT_WIDTH"
    persist
  >
    <template
      v-if="isAsync ? true : loaded"
    >
      <div
        v-for="(drop, index) in drops"
        :key="`${isDrop(drop) ? drop.collection?.id : drop.id}=${index}`"
        class="w-full h-full"
        :data-testid="index"
      >
        <slot
          name="card"
          :item="drop as InternalDropCalendar"
        >
          <DropCard :drop="drop as Drop" />
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
import type { Drop } from './useDrops'
import type { InternalDropCalendar } from './calendar/DropsCalendar.vue'
import DropCard from '@/components/drops/DropCard.vue'

const GRID_DEFAULT_WIDTH = {
  small: 0,
  medium: DROP_CARD_MIN_WIDTH,
  large: 0,
}

const props = defineProps<{
  drops: Drop[] | InternalDropCalendar[]
  loaded: boolean
  defaultSkeletonCount: number
  asyncSkeletonCount?: number
  skeletonKey: string
  clickable?: boolean
}>()

const isAsync = computed(() => typeof props.asyncSkeletonCount === 'number')

const isDrop = (item: Drop | InternalDropCalendar): item is Drop =>
  (item as Drop).collection !== undefined
</script>
