<template>
  <div>
    <SigningModal
      v-if="!autoTeleport"
      :title="$t('listingCart.listingNft', itemCount)"
      :is-loading="isLoading"
      :status="status"
      close-in-block
      @try-again="submitListing"
    />

    <NeoModal
      :value="isSuccessModalOpen"
      append-to-body
      @close="handleSuccessModalClose"
    >
      <ModalBody
        :title="$t('success')"
        @close="handleSuccessModalClose"
      >
        <SuccessfulListingBody
          :tx-hash="txHash"
          :items="items"
          :status="status"
        />
      </ModalBody>
    </NeoModal>

    <NeoModal
      :value="preferencesStore.listingCartModalOpen"
      append-to-body
      @close="onClose"
    >
      <ModalBody
        modal-max-height="100vh"
        :title="title"
        content-class="pt-4 pb-5 px-0"
        :scrollable="false"
        :loading="!autoTeleportLoaded"
        @close="onClose"
      >
        <div class="px-6 max-h-[50vh] overflow-y-auto">
          <ModalIdentityItem />

          <ListingCartSingleItemCart
            v-if="listingCartStore.count === 1"
            v-model:fixed-price="fixedPrice"
            v-model:floor-price-percent-adjustment="floorPricePercentAdjustment"
            @set-fixed-price="setFixedPrice"
          />

          <ListingCartMultipleItemsCart
            v-else
            v-model:fixed-price="fixedPrice"
            v-model:floor-price-percent-adjustment="floorPricePercentAdjustment"
            @set-fixed-price="setFixedPrice"
          />
        </div>

        <div class="border-t pt-5 pb-4 px-6">
          <div class="flex justify-between">
            {{ $t('listingCart.potentialEarnings') }}
            <div class="flex">
              <span class="ml-2 text-k-grey">{{ totalNFTsPrice.toFixed(4) }} {{ chainSymbol }}</span>
              <span class="font-bold ml-2"> ${{ priceUSD }} </span>
            </div>
          </div>

          <div
            class="flex justify-between text-k-grey pb-4 mt-3 border-b-k-shade"
          >
            <span>{{ $t('listingCart.listingFees') }}</span>
            <span class="ml-2">{{ formattedTxFees }}</span>
          </div>
        </div>

        <div class="flex justify-between px-6">
          <AutoTeleportActionButton
            ref="autoTeleportButton"
            :actions="actions"
            :disabled="confirmButtonDisabled"
            :fees="{ forceActionAutoFees: true }"
            :label="confirmListingLabel"
            early-success
            auto-close-modal
            :auto-close-modal-delay-modal="0"
            @confirm="confirm"
          />
        </div>
      </ModalBody>
    </NeoModal>
  </div>
</template>

<script setup lang="ts">
import { Interaction } from '@kodadot1/static'
import { NeoModal } from '@kodadot1/brick'
import ListingCartSingleItemCart from './singleItemCart/ListingCartSingleItemCart.vue'
import ListingCartMultipleItemsCart from './multipleItemsCart/ListingCartMultipleItemsCart.vue'
import { prefixToToken } from '@/components/common/shoppingCart/utils'
import ModalBody from '@/components/shared/modals/ModalBody.vue'
import { usePreferencesStore } from '@/stores/preferences'
import type { TokenToList, Actions } from '@/composables/transaction/types'
import type { ListCartItem } from '@/stores/listingCart'
import { useListingCartStore } from '@/stores/listingCart'
import { calculateBalance } from '@/utils/format/balance'
import { warningMessage } from '@/utils/notification'
import { useFiatStore } from '@/stores/fiat'
import { calculateExactUsdFromToken } from '@/utils/calculation'
import { sum } from '@/utils/math'
import ModalIdentityItem from '@/components/shared/ModalIdentityItem.vue'
import AutoTeleportActionButton, {
  type AutoTeleportActionButtonConfirmEvent,
} from '@/components/common/autoTeleport/AutoTeleportActionButton.vue'
import type { AutoTeleportAction } from '@/composables/autoTeleport/types'
import { hasOperationsDisabled } from '@/utils/prefix'
import useAutoTeleportActionButton from '@/composables/autoTeleport/useAutoTeleportActionButton'

const { urlPrefix } = usePrefix()
const preferencesStore = usePreferencesStore()
const listingCartStore = useListingCartStore()
const { closeListingCartModal } = useListingCartModal()
const { $i18n } = useNuxtApp()
const {
  transaction,
  isLoading,
  status,
  isError,
  blockNumber,
  txHash,
  clear: clearTransaction,
} = useTransaction()

const { isTransactionSuccessful } = useTransactionSuccessful({
  status,
  isError,
  isLoading,
})

const { chainSymbol, decimals } = useChain()

const fixedPrice = ref()
const floorPricePercentAdjustment = ref()

const itemCount = ref(listingCartStore.count)
const items = ref<ListCartItem[]>([])

const isSuccessModalOpen = ref(false)

function setFixedPrice() {
  const rate = Number(fixedPrice.value) || 0

  listingCartStore.setFixedPrice(rate)
}

watch(floorPricePercentAdjustment, (rate) => {
  listingCartStore.setFloorPrice(rate)
})

const fiatStore = useFiatStore()

const getAction = (items: ListCartItem[]): Actions => {
  const token = items
    .filter((item): item is ListCartItem & { listPrice: number } =>
      Boolean(item.listPrice),
    )
    .map(item => ({
      price: String(calculateBalance(item.listPrice, decimals.value)),
      nftId: item.id,
    })) as TokenToList[]

  return {
    interaction: Interaction.LIST,
    urlPrefix: urlPrefix.value,
    token,
    successMessage: $i18n.t('transaction.price.success') as string,
    errorMessage: $i18n.t('transaction.price.error') as string,
  }
}

const { action, autoTeleport, autoTeleportButton, autoTeleportLoaded, formattedTxFees } = useAutoTeleportActionButton({
  getActionFn: () => getAction(listingCartStore.itemsInChain),
})

const actions = computed<AutoTeleportAction[]>(() => [
  {
    action: action.value,
    transaction,
    details: {
      isLoading: isLoading.value,
      status: status.value,
      isError: isError.value,
      blockNumber: blockNumber.value,
    },
  },
])

const priceUSD = computed(() =>
  calculateExactUsdFromToken(
    totalNFTsPrice.value,
    Number(fiatStore.getCurrentTokenValue(prefixToToken[urlPrefix.value])),
  ),
)

const totalNFTsPrice = computed(() =>
  Number(
    sum(
      listingCartStore.itemsInChain.map(nft => Number(nft.listPrice || 0)),
    ).toFixed(4),
  ),
)

const cartHasNFTsWithPrice = computed(() =>
  listingCartStore.itemsInChain.map(nft => Number(nft.price)).some(Boolean),
)
const showChangePriceModal = computed(
  () => cartHasNFTsWithPrice.value && listingCartStore.count === 1,
)

const title = computed(() => {
  const items
    = listingCartStore.count === 1
      ? 'NFT'
      : `${listingCartStore.count} ${$i18n.t('items')}`

  return showChangePriceModal.value
    ? $i18n.t('transaction.price.change')
    : `List ${items}`
})

const confirmButtonDisabled = computed(
  () =>
    hasOperationsDisabled(urlPrefix.value)
    || Boolean(listingCartStore.incompleteListPrices)
    || !autoTeleportButton.value?.isReady,
)

const confirmListingLabel = computed(() => {
  if (hasOperationsDisabled(urlPrefix.value)) {
    return $i18n.t('toast.unsupportedOperation')
  }
  switch (listingCartStore.incompleteListPrices) {
    case 0:
      if (!autoTeleportButton.value?.isReady) {
        return $i18n.t('autoTeleport.checking')
      }

      return showChangePriceModal.value
        ? $i18n.t('transaction.price.change')
        : $i18n.t('listingCart.complete')
    case 1:
      return listingCartStore.count === 1
        ? $i18n.t('listingCart.inputPriceFirst')
        : $i18n.t('listingCart.missing1')
    default:
      return `${listingCartStore.incompleteListPrices} ${$i18n.t(
        'listingCart.missingMultiple',
      )}`
  }
})

const submitListing = () => {
  return transaction(getAction(items.value || []))
}

async function confirm({ autoteleport }: AutoTeleportActionButtonConfirmEvent) {
  try {
    clearTransaction()

    autoTeleport.value = autoteleport
    itemCount.value = listingCartStore.count
    items.value = [...listingCartStore.itemsInChain]

    if (!autoteleport) {
      await submitListing()
    }

    closeListingCartModal()
    onModalAnimation(() => {
      listingCartStore.clearListedItems()
      resetCartToDefaults()
    })
  }
  catch (error) {
    warningMessage(error)
  }
}

const onClose = () => {
  closeListingCartModal()
  onModalAnimation(resetCartToDefaults)
}

const handleSuccessModalClose = () => {
  isSuccessModalOpen.value = false
  onModalAnimation(() => {
    items.value = []
    isTransactionSuccessful.value = false
  })
}

const resetCartToDefaults = () => {
  fixedPrice.value = undefined
  floorPricePercentAdjustment.value = undefined
}

watch(computed(() => Boolean(items.value.length) && isTransactionSuccessful.value), (show) => {
  if (show) {
    isSuccessModalOpen.value = show
  }
})

watch(
  () => listingCartStore.count,
  () => {
    if (listingCartStore.count === 0) {
      closeListingCartModal()
    }
  },
)

useModalIsOpenTracker({
  isOpen: computed(() => preferencesStore.listingCartModalOpen),
  onChange: () => listingCartStore.clearDiscardedItems(),
})

onBeforeMount(closeListingCartModal)
onUnmounted(closeListingCartModal)
</script>

<style lang="scss" scoped>
:deep(.identity-name-font-weight-regular) {
  .identity-name {
    font-weight: unset !important;
  }
}
</style>
