<template>
  <div>
    <h1 class="title is-2 mb-7">
      {{ $i18n.t('drops.title') }}
    </h1>
    <div class="grid-container">
      <template v-if="loading">
        <DropsDropCardSkeleton v-for="x in skeletonCount" :key="x" />
      </template>
      <template v-else>
        <div
          v-for="(drop, index) in drops"
          :key="`${drop.collection?.id}=${index}`"
          class="w-full h-full"
          :data-testid="index">
          <DropCard :drop="drop" />
        </div>
      </template>
    </div>
    <hr class="my-7" />
    <div>
      <CreateDropCard />
    </div>
  </div>
</template>

<script lang="ts" setup>
import DropCard from '@/components/drops/DropCard.vue'
import CreateDropCard from '@/components/drops/CreateDropCard.vue'

import { useDrops } from './useDrops'
import { dropsVisible } from '@/utils/config/permission.config'

const { $i18n } = useNuxtApp()
const { drops, loading } = useDrops()
const { urlPrefix } = usePrefix()

const skeletonCount = ref(2)

const checkRouteAvailability = () => {
  if (!dropsVisible(urlPrefix.value)) {
    navigateTo('/')
  }
}

watch(urlPrefix, () => checkRouteAvailability())

onBeforeMount(() => {
  checkRouteAvailability()
})
</script>

<style lang="scss" scoped>
$gap: 1rem;
.grid-container {
  display: grid;
  gap: $gap;
  grid-template-columns: repeat(1, 1fr);
}

@media (min-width: 1000px) {
  $max-card-width: calc(910px + 0.5 * #{$gap});
  .grid-container {
    grid-template-columns: repeat(2, minmax(0, $max-card-width));
    max-width: calc(2 * $max-card-width);
  }
}
</style>
