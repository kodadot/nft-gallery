<template>
  <div ref="container">
    <template v-if="isDynamicGridReady">
      <CarouselModuleCarouselAgnostic
        v-if="isReady"
        :key="dropsAlias.join('-')"
        v-slot="{ item }"
        :items="drops"
        :config="config">
        <DropsDropCard :drop="item" />
      </CarouselModuleCarouselAgnostic>
      <CarouselModuleCarouselAgnostic
        v-else
        :items="Array(skeletonCount).fill({ id: 'drop-skeleton' })"
        :config="config">
        <DropsDropCardSkeleton />
      </CarouselModuleCarouselAgnostic>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { useDrops } from '@/components/drops/useDrops'

let queries = {
  limit: 12,
  active: [true],
  chain: ['ahp'],
}

if (!isProduction) {
  queries = {
    ...queries,
    chain: ['ahp', 'ahk'],
  }
}

const container = ref()

const { cols, isReady: isDynamicGridReady } = useDynamicGrid({
  container,
  itemMintWidth: computed(() => DROP_CARD_MIN_WIDTH),
})

const perView = computed(() => (cols.value === 1 ? 1.2 : cols.value))
const config = computed(() => ({
  slides: { perView: perView.value, spacing: 16 },
}))
const skeletonCount = computed(() =>
  Number.isInteger(perView.value) ? perView.value : Math.ceil(perView.value),
)

const { drops, loaded: isReady } = useDrops(queries)
const dropsAlias = computed(() => drops.value.map((drop) => drop.alias))
</script>
