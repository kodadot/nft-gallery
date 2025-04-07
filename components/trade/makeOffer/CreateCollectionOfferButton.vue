<template>
  <div>
    <NeoButton
      variant="secondary"
      @click="onCreateCollectionOfferClick"
    >
      {{ $t('offer.createCollectionOffer') }}
    </NeoButton>
    <TradeMakeOfferModal />
  </div>
</template>

<script lang="ts" setup>
import { NeoButton } from '@kodadot1/brick'
import { useCollectionMinimal } from '@/components/collection/utils/useCollectionDetails'
import { useMakingOfferStore } from '@/stores/makeOffer'
import type { MakingOfferItem } from '@/components/trade/types'

const { $i18n } = useNuxtApp()

const props = defineProps<{
  collectionId: string
}>()
const preferencesStore = usePreferencesStore()
const collectionId = computed(() => props.collectionId)
const makeOfferStore = useMakingOfferStore()

const { data: collectionOfferData } = useGraphql<{ offers: NFTOffer[] }>({
  queryName: 'highestOfferByCollectionId',
  variables: {
    id: collectionId.value,
  },
})

const { collection } = useCollectionMinimal({
  collectionId: collectionId,
})

const { onTradeActionClick } = useTradeActionClick()
const { urlPrefix } = usePrefix()
const highestOfferPrice = computed(() => (collectionOfferData.value)?.offers[0]?.price)

const openOfferModal = () => {
  makeOfferStore.clear()
  const item = {
    id: null,
    name: $i18n.t('offer.anyNftFromCollection'),
    highestOffer: highestOfferPrice.value,
    urlPrefix: urlPrefix.value,
    collection: collection.value,
    metadata: collection.value?.metadata,
    meta: {
      image: collection.value?.meta?.image,
    },
    sn: null,
    currentOwner: collection.value?.currentOwner,
  }
  makeOfferStore.setItem(item as MakingOfferItem)

  preferencesStore.setMakeOfferModalOpen(true)
}

const onCreateCollectionOfferClick = () => {
  onTradeActionClick(openOfferModal)
}
</script>
