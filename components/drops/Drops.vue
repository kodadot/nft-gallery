<template>
  <div>
    <div class="has-text-weight-bold is-size-5 mb-7">
      {{ $i18n.t('drops.title') }}
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
        <DropCard :drop="drop" :drop-start-time="drop.dropStartTime" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import DropCard from '@/components/drops/DropCard.vue'
import { collectionId } from '@/components/collection/unlockable/const'
import { useDrops } from './useDrops'

const drops = useDrops(collectionId)
</script>

<style lang="scss" scoped>
.grid-container {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(1, 1fr);
}

@media (min-width: 1000px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
