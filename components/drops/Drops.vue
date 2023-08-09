<template>
  <div>
    <div class="title is-2 mb-7">
      {{ $i18n.t('drops.title') }}
    </div>
    <div v-if="drops.drops.length" class="grid-container">
      <div
        v-for="(drop, index) in drops.drops"
        :key="`${drop.collection.id}=${index}`"
        class="w-full h-full"
        :data-cy="index">
        <DropCard :drop="drop" />
      </div>
      <template v-if="statemintDrops.drops.length">
        <div
          v-for="(drop, index) in statemintDrops.drops"
          :key="`${drop.collection.id}=${index}`"
          class="w-full h-full"
          :data-cy="index">
          <DropCard
            :drop="drop"
            override-url-prefix="stt"
            drop-url="dot-drop" />
        </div>
      </template>
    </div>
    <div class="title is-2 my-7">
      {{ $i18n.t('drops.upcoming') }}
    </div>
    <div v-if="drops.futureDrops.length" class="grid-container">
      <div
        v-for="(drop, index) in drops.futureDrops"
        :key="`${drop.collection.id}=${index}`"
        class="w-full h-full"
        :data-cy="index">
        <DropCard :drop="drop" />
      </div>
    </div>
    <div v-else class="title is-4 has-text-grey has-text-centered">
      {{ $i18n.t('drops.noUpcoming') }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import DropCard from '@/components/drops/DropCard.vue'
import { collectionId } from '@/components/collection/unlockable/const'
import { STT_COLLECTION_ID } from '@/components/collection/drop/const'
import { useDrops } from './useDrops'

const { $i18n } = useNuxtApp()
const drops = useDrops(collectionId)
const statemintDrops = useDrops(STT_COLLECTION_ID, 'ahp')

console.log('drops', statemintDrops)
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
