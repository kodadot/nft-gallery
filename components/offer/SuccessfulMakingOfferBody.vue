<template>
  <SuccessfulModalBody
    :tx-hash="txHash"
    :share="share"
    :status="status"
    :action-buttons="actionButtons"
  >
    <SuccessfulItemsMedia
      :header="{
        single: $t('offer.newOffer'),
        multiple: $t('offer.newOffer'),
      }"
      :items="mediaItems"
      show-price
    />
  </SuccessfulModalBody>
</template>

<script lang="ts" setup>
import type { MakingOfferItem } from './types'
import type { ItemMedia } from '@/components/common/successfulModal/SuccessfulItemsMedia.vue'
import type { TransactionStatus } from '@/composables/useTransactionStatus'

const props = defineProps<{
  items: MakingOfferItem[]
  txHash: string | undefined
  status: TransactionStatus
}>()

const { $i18n } = useNuxtApp()
const { decimals } = useChain()
const { urlPrefix } = usePrefix()

const mediaItems = computed<ItemMedia[]>(() =>
  props.items.map(item => ({
    id: item.id,
    image: (item.meta?.image) as string,
    name: item.name,
    collection: item.collection.id,
    collectionName: item.collection.name,
    mimeType: item.meta?.mimeType,
    price: item.offerPrice
      ? String(Number(item.offerPrice) * Math.pow(10, decimals.value))
      : undefined,
    metadata: item.meta?.mediaUri as string,
  })),
)

const singleListing = computed(() => props.items.length === 1)

const url = computed(() => window.location.origin)

const nftPath = computed(
  () => `/${urlPrefix.value}/gallery/${props.items[0].id}`,
)

const shareUrl = computed(() => `${url.value}${nftPath.value}`,
)

const share = computed(() => ({
  text: $i18n.t('sharing.makeOfferNft'),
  withCopy: singleListing.value,
  url: shareUrl.value,
}))

const actionButtons = computed(() => ({
  primary: {
    label: $i18n.t('viewNft', props.items.length),
    onClick: handleViewNft,
  },
}))

const handleViewNft = () => {
  window.open(shareUrl.value, '_blank')
}
</script>
