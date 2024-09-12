<template>
  <div ref="container">
    <template v-if="isDynamicGridReady">
      <CarouselModuleCarouselAgnostic
        v-if="isReady && dropsAlias"
        :key="dropsAlias.join('-')"
        v-slot="{ item }"
        :items="drops"
        :config="config"
      >
        <DropsDropItem
          :drop="item"
          :show-minted="true"
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
import { useQuery } from '@tanstack/vue-query'
import { dropsVisible } from '@/utils/config/permission.config'
import { getDrops } from '@/services/fxart'

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

const { data: drops, isSuccess: isReady } = useQuery({
  queryKey: ['drop-items-carousel', urlPrefix.value],
  queryFn: () => getDrops({
    active: [true],
    chain: dropsVisible(urlPrefix.value) ? [urlPrefix.value] : ['base', 'ahp'],
    limit: 14,
  }),
})

const dropsAlias = computed(() => drops.value?.map(drop => drop.alias))
</script>
