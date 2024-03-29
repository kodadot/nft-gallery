<template>
  <DynamicGrid grid-size="medium" :default-width="GRID_DEFAULT_WIDTH" persist>
    <template v-if="!loaded">
      <DropsDropCardSkeleton
        v-for="x in defaultSkeletonCount"
        :key="`${skeletonKey}-${x}`" />
    </template>
    <div
      v-for="(drop, index) in drops"
      v-else
      :key="`${isDrop(drop) ? drop.collection?.id : drop.id}=${index}`"
      class="w-full h-full"
      :data-testid="index">
      <slot name="card" :item="drop as InternalDropCalendar">
        <DropCard :drop="drop as Drop" />
      </slot>
    </div>
  </DynamicGrid>
</template>
<script lang="ts" setup>
import DropCard from '@/components/drops/DropCard.vue'
import { Drop } from './useDrops'
import { InternalDropCalendar } from './calendar/DropsCalendar.vue'

const GRID_DEFAULT_WIDTH = {
  small: 0,
  medium: DROP_CARD_MIN_WIDTH,
  large: 0,
}

defineProps<{
  drops: Drop[] | InternalDropCalendar[]
  loaded: boolean
  defaultSkeletonCount: number
  skeletonKey: string
  clickable?: boolean
}>()

const isDrop = (item: Drop | InternalDropCalendar): item is Drop =>
  (item as Drop).collection !== undefined
</script>
