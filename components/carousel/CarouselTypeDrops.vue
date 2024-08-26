<template>
  <div ref="container">
    <template v-if="isDynamicGridReady">
      <CarouselModuleCarouselAgnostic
        v-if="isReady"
        :key="dropsAlias.join('-')"
        v-slot="{ item }"
        :items="drops"
        :config="config"
      >
        <DropsDropCard
          :drop="item"
        />
      </CarouselModuleCarouselAgnostic>
      <CarouselModuleCarouselAgnostic
        v-else
        :items="Array(skeletonCount).fill({ id: 'drop-skeleton' })"
        :config="config"
      >
        <DropsDropCardSkeleton />
      </CarouselModuleCarouselAgnostic>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { useDrops } from '@/components/drops/useDrops'

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

const { urlPrefix } = usePrefix()
const { drops, loaded: isReady } = useDrops({
  limit: 14,
  active: [true],
  chain: [urlPrefix.value],
}, { filterOutMinted: true })

const dropsAlias = computed(() => drops.value.map(drop => drop.alias))
</script>
