<template>
  <div ref="container">
    <div class="has-text-weight-bold is-size-5 mb-7">
      {{ $i18n.t('drops.drops') }}
    </div>
    <div v-if="drops.drops.length" class="grid-container">
      <div
        v-for="(drop, index) in drops.drops"
        :key="`${drop.collection.id}=${index}`"
        class="w-full h-full"
        :data-cy="index">
        <DropCard
          :drop="drop"
          :variant="cardVariant"
          :drop-start-time="drop.dropStartTime" />
      </div>
    </div>
    <div class="has-text-weight-bold is-size-5 my-7">
      {{ $i18n.t('drops.upcoming') }}
    </div>
    <div v-if="drops.futureDrops.length" class="grid-container">
      <div
        v-for="(drop, index) in drops.futureDrops"
        :key="`${drop.collection.id}=${index}`"
        class="w-full h-full"
        :data-cy="index">
        <DropCard
          :drop="drop"
          :variant="cardVariant"
          :drop-start-time="drop.dropStartTime" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import DropCard from '@/components/drops/DropCard.vue'
import { collectionId } from '@/components/collection/unlockable/const'
import { useResizeObserver } from '@vueuse/core'
import { useDrops } from './useDrops'
const container = ref<HTMLDivElement | null>(null)

const cardBreakPoints = {
  large: 500,
  medium: 400,
}

const getSizeBasedOnBreakPoints = (
  width,
  breakPoints: { [size: string]: number }
) => {
  for (const [size, breakPoint] of Object.entries(breakPoints)) {
    if (width >= breakPoint) {
      return size
    }
  }
  return 'small'
}

const cardVariant = ref('large')

useResizeObserver(container, (entries) => {
  const entry = entries[0]
  const width = entry.contentRect.width

  cardVariant.value = getSizeBasedOnBreakPoints(width, cardBreakPoints)
})

const drops = useDrops(collectionId)
</script>

<style lang="scss" scoped>
.grid-container {
  display: grid;
  gap: 1rem; /* gap between grid items */
  grid-template-columns: repeat(1, 1fr); /* 1 column by default */
}

@media (min-width: 1000px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
