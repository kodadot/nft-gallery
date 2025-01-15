<template>
  <div class="flex flex-col gap-4">
    <SwapGridListFilters
      v-if="withFilters"
      v-model="collections"
      :query
    />

    <ItemsGrid
      :search="query"
      grid-size="medium"
      :grid-section="gridSection"
      link-target="_blank"
      :hide-hover-action="!selectable || stepItems.length === MAX_AMOUNT_OF_SWAP_ITEMS"
    >
      <template
        v-if="surcharge"
        #additional-item
      >
        <SwapSurchargeCard
          :surcharge="surcharge"
        />
      </template>
    </ItemsGrid>
  </div>
</template>

<script lang="ts" setup>
import ItemsGrid from '@/components/items/ItemsGrid/ItemsGrid.vue'
import { type SwapSurcharge } from '@/composables/transaction/types'

const gridSection = GridSection.PROFILE_GALLERY

const MAX_AMOUNT_OF_SWAP_ITEMS = 1

const props = defineProps<{
  query: Record<string, any>
  selectable?: boolean
  withFilters?: boolean
  surcharge?: SwapSurcharge
}>()

const route = useRoute()
const { replaceUrl } = useReplaceUrl()
const { stepItems } = storeToRefs(useAtomicSwapStore())

const collections = ref(route.query.collections?.toString().split(',').filter(Boolean) || [])

const query = computed(() => {
  const q = { ...props.query }

  if (collections.value.length) {
    q.collection = {
      id_in: collections.value,
    }
  }

  return q
})

watch(collections, (value) => {
  replaceUrl({
    collections: value.length ? value.toString() : undefined,
  })
})
</script>
