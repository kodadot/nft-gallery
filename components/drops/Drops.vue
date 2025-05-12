<template>
  <div>
    <div class="flex max-md:flex-col md:items-center justify-between mb-7 md:gap-8">
      <h1 class="text-4xl font-semibold text-balance">
        <span>{{ $i18n.t('drops.title') }}</span>
      </h1>

      <div class="max-md:pt-8 flex items-center flex-col md:flex-row gap-6 max-md:gap-4 md:justify-end grow">
        <nuxt-link
          class="shrink-0"
          to="https://form.kodadot.xyz/drop-interest"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>{{ $t('drops.createYourOwn') }}</span>
          <KIcon name="i-mdi:arrow-top-right" />
        </nuxt-link>
      </div>
    </div>

    <DynamicGrid
      grid-size="medium"
      :default-width="GRID_DEFAULT_WIDTH"
      persist
    >
      <DropsDropItem
        v-for="drop in dropItems"
        :key="drop.id"
        :drop="drop"
      />
    </DynamicGrid>

    <DropsCalendar :default-skeleton-count="4" />

    <template v-if="sortedMintedDrops.length">
      <hr class="my-14">

      <h2 class="text-3xl font-semibold mb-7">
        {{ $i18n.t('drops.pastArtDrops') }}
      </h2>

      <DynamicGrid
        grid-size="medium"
        :default-width="GRID_DEFAULT_WIDTH"
        persist
      >
        <DropsDropCard
          v-for="drop in sortedMintedDrops"
          :key="drop.collection"
          :drop="drop"
        />
      </DynamicGrid>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query'
import { getDrops } from '@/services/fxart'

const { $i18n } = useNuxtApp()
const { urlPrefix } = usePrefix()

const { data: dropItems } = useQuery({
  queryKey: ['drop-items', urlPrefix.value],
  queryFn: () => getDrops({
    active: [true],
    chain: [urlPrefix.value],
    limit: 100,
  }),
})

const { isEvm } = useIsChain(urlPrefix)
const mintedDrops = useMintedDropsStore()
const sortedMintedDrops = computed(() => isEvm.value ? mintedDrops.getMintedDrops : mintedDrops.sortedMintedDrops)

onBeforeMount(() => {
  mintedDrops.clearMintedDrops()
})

const GRID_DEFAULT_WIDTH = {
  small: 0,
  medium: DROP_CARD_MIN_WIDTH,
  large: 0,
}
</script>
