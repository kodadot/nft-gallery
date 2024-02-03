<template>
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
    <template v-else>
      <div
        class="flex flex-col gap-3"
        :class="{
          'max-h-[260px] overflow-hidden': !expanded,
          'max-h-[390px] overflow-y-auto': expanded,
        }">
        <div
          v-for="item in items"
          :key="item.id"
          class="flex flex-row items-center gap-3">
          <BaseMediaItem
            class="border border-k-shade aspect-square w-8"
            :src="sanitizeIpfsUrl(item.meta?.image)"
            preview
            is-detail />

          <p>{{ item.name }}</p>
        </div>
      </div>

      <div
        v-if="showMore"
        class="flex mt-4 items-center"
        :class="[expanded ? 'justify-end' : 'justify-between']">
        <div v-if="!expanded" class="flex items-center gap-3">
          <div
            class="bg-k-grey-light px-2 py-1 rounded-full text-k-grey text-xs w-8">
            +{{ moreItems }}
          </div>
          <span class="text-k-grey text-xs">{{ $t('items') }}</span>
        </div>

        <a class="text-xs text-k-grey" @click="expanded = !expanded">{{
          expanded ? $t('showLess') : $t('showAll')
        }}</a>
      </div>

      <div class="mt-5 border-b-k-shade">
        <p class="is-size-6 capitalize font-bold text-center">
          {{ $t('buyModal.amountPurchaseSuccessfully', [items.length]) }}
        </p>
      </div>
    </template>
  </SuccessfulModal>

  <ListingCartModal />
</template>
<script setup lang="ts">
import { ShoppingCartItem } from '@/components/common/shoppingCart/types'

const COLLAPSED_ITEMS_COUNT = 6

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

const expanded = ref(false)
const canListItems = ref(false)
const nftSubscription = ref(() => {})

const singleBuy = computed(() => props.items.length === 1)
const firsItem = computed(() => props.items[0])
const moreItems = computed(() => props.items.length - COLLAPSED_ITEMS_COUNT)
const showMore = computed(() => props.items.length > COLLAPSED_ITEMS_COUNT)

const shareText = computed(() => {
  if (singleBuy.value) {
    return $i18n.t('sharing.boughtNft')
  }

  const someNfts = props.items.slice(0, 3).map((item) => item.name)

  return $i18n.t('sharing.boughtNfts', [someNfts.join(', ')])
})

const url = computed(() => window.location.origin)
const userProfilePath = computed(
  () => `/${urlPrefix.value}/u/${accountId.value}`,
)
const nftPath = computed(
  () => `/${urlPrefix.value}/gallery/${firsItem.value.id}`,
)

const shareUrl = computed(() =>
  singleBuy.value
    ? `${url.value}/${nftPath.value}`
    : `${url.value}/${userProfilePath.value}`,
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
