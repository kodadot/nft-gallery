<template>
  <div>
    <SuccessfulModal
      v-model="isModalActive"
      :tx-hash="txHash"
      :share="share"
      :action-buttons="actionButtons">
      <template v-if="singleBuy">
        <SingleItemMedia
          :header="$t('buyModal.purchaseSuccessful')"
          :src="sanitizeIpfsUrl(firsItem.meta?.image)"
          :nft-name="firsItem.name"
          :collection-id="firsItem.collection.id"
          :collection-name="firsItem.collection.name" />
      </template>
      <MultiItemMedia v-else :items="processedItems" />
    </SuccessfulModal>

    <ListingCartModal />
  </div>
</template>

<script setup lang="ts">
import { ShoppingCartItem } from '@/components/common/shoppingCart/types'

defineEmits(['modelValue'])
const props = defineProps<{
  modelValue: boolean
  txHash: string
  items: ShoppingCartItem[]
}>()

const isModalActive = useVModel(props, 'modelValue')

const { $i18n } = useNuxtApp()
const { urlPrefix } = usePrefix()
const { accountId } = useAuth()
const { listNftByShoppingCartItem, openListingCartModal } =
  useListingCartModal()

const canListItems = ref(false)
const nftSubscription = ref(() => {})

const singleBuy = computed(() => props.items.length === 1)
const firsItem = computed(() => props.items[0])

const shareText = computed(() => {
  if (singleBuy.value) {
    return $i18n.t('sharing.boughtNft')
  }

  const someNfts = props.items.slice(0, 3).map((item) => item.name)

  return $i18n.t('sharing.boughtNfts', [someNfts.join(', ')])
})

const processedItems = computed(() =>
  props.items.map((item) => ({
    id: item.id,
    name: item.name,
    image: sanitizeIpfsUrl(item.meta?.image),
  })),
)

const url = computed(() => window.location.origin)
const userProfilePath = computed(
  () => `/${urlPrefix.value}/u/${accountId.value}`,
)
const nftPath = computed(
  () => `/${urlPrefix.value}/gallery/${firsItem.value.id}`,
)

const shareUrl = computed(() =>
  singleBuy.value
    ? `${url.value}${nftPath.value}`
    : `${url.value}${userProfilePath.value}`,
)

const share = computed(() => ({
  text: shareText.value,
  withCopy: singleBuy.value,
  url: shareUrl.value,
}))

const actionButtons = computed(() => ({
  secondary: {
    label: $i18n.t('viewNft', props.items.length),
    onClick: handleViewNft,
  },
  primary: {
    label: $i18n.t('listNft', props.items.length),
    onClick: handleListNft,
    disabled: !canListItems.value,
  },
}))

const handleListNft = () => {
  props.items.forEach(listNftByShoppingCartItem)
  openListingCartModal()
  isModalActive.value = false
}

const handleViewNft = () => {
  isModalActive.value = false
  navigateTo(singleBuy.value ? nftPath.value : userProfilePath.value)
}

const watchCurrentOwners = () => {
  const ids = props.items.map((item) => item.id)
  nftSubscription.value = useSubscriptionGraphql({
    query: `nftEntities(where: {
        id_in: ${JSON.stringify(ids)}
    }) {
      currentOwner
    }`,
    onChange: ({ data: { nftEntities } }) => {
      const currentOwners: string[] = nftEntities.map((nft) => nft.currentOwner)
      canListItems.value = currentOwners.every(
        (currentOwner) => currentOwner === accountId.value,
      )
    },
  })
}

const unsubscribeSubscription = () => nftSubscription.value()

onBeforeUnmount(unsubscribeSubscription)

watch(
  () => props.modelValue,
  (isOpen: boolean) => {
    if (isOpen) {
      watchCurrentOwners()
    } else {
      unsubscribeSubscription()
    }
  },
)
</script>
