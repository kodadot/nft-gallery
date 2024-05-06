<template>
  <SuccessfulModalBody
    :tx-hash="txHash"
    :share="share"
    :action-buttons="actionButtons">
    <SuccessfulItemsMedia
      :header="{
        single: $t('listingCart.newListingPrice'),
        multiple: $t('listingCart.bulkListingSuccessful'),
      }"
      :items="mediaItems"
      show-price />
  </SuccessfulModalBody>
</template>
<script lang="ts" setup>
import type { ItemMedia } from '@/components/common/successfulModal/SuccessfulItemsMedia.vue'

const props = defineProps<{
  items: ListCartItem[]
  txHash: string | undefined
}>()

const { $i18n } = useNuxtApp()
const { decimals } = useChain()
const { urlPrefix } = usePrefix()
const { accountId } = useAuth()

const mediaItems = computed<ItemMedia[]>(() =>
  props.items.map((item) => ({
    id: item.id,
    image: (item.mediaUrl?.image || item.meta?.image) as string,
    name: item.name,
    collection: item.collection.id,
    collectionName: item.collection.name,
    mimeType: item.mediaUrl?.mimeType,
    price: item.listPrice
      ? String(item.listPrice * Math.pow(10, decimals.value))
      : undefined,
  })),
)

const singleListing = computed(() => props.items.length === 1)

const shareText = computed(() => {
  if (singleListing.value) {
    return $i18n.t('sharing.listedNft')
  }

  const someNfts = props.items.map((item) => item.name)

  return $i18n.t('sharing.listedNfts', [someNfts.join(', ')])
})

const url = computed(() => window.location.origin)
const userProfilePath = computed(
  () => `/${urlPrefix.value}/u/${accountId.value}?buy_now=true`,
)
const nftPath = computed(
  () => `/${urlPrefix.value}/gallery/${props.items[0].id}`,
)

const shareUrl = computed(() =>
  singleListing.value
    ? `${url.value}${nftPath.value}`
    : `${url.value}${userProfilePath.value}`,
)

const share = computed(() => ({
  text: shareText.value,
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
