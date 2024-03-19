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
      :key="`${drop.collection?.id}=${index}`"
      class="w-full h-full"
      :data-testid="index">
      <slot name="card" :item="drop">
        <DropCard :drop="drop" />
      </slot>
    </div>
  </DynamicGrid>
</template>
<script lang="ts" setup>
import DropCard from '@/components/drops/DropCard.vue'

defineProps<{
  drops: any[]
  loaded: boolean
  defaultSkeletonCount: number
  skeletonKey: string
  clickable?: boolean
}>()

const GRID_DEFAULT_WIDTH = {
  small: 0,
  medium: DROP_CARD_MIN_WIDTH,
  large: 0,
}
</script>
