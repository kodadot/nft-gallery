<template>
  <div>
    <Loader v-if="!autoTeleport" v-model="isLoading" :status="status" />
    <NeoModal
      :value="preferencesStore.listingCartModalOpen"
      scroll="clip"
      append-to-body
      @close="onClose">
      <ModalBody
        modal-max-height="100vh"
        :title="title"
        content-class="pt-4 pb-5 px-0"
        :scrollable="false"
        :loading="loadingAutoTeleport"
        @close="onClose">
        <div class="px-6 limit-height">
          <ModalIdentityItem />

          <ListingCartSingleItemCart
            v-if="listingCartStore.count === 1"
            v-model:fixedPrice="fixedPrice"
            v-model:floorPricePercentAdjustment="floorPricePercentAdjustment"
            @setFixedPrice="setFixedPrice" />

          <ListingCartMultipleItemsCart
            v-else
            v-model:fixedPrice="fixedPrice"
            v-model:floorPricePercentAdjustment="floorPricePercentAdjustment"
            @setFixedPrice="setFixedPrice" />
        </div>

        <div class="border-top pt-5 pb-4 px-6">
          <div class="flex justify-between">
            {{ $t('listingCart.potentialEarnings') }}
            <div class="flex">
              <span class="ml-2 has-text-grey"
                >{{ totalNFTsPrice.toFixed(4) }} {{ chainSymbol }}</span
              >
              <span class="has-text-weight-bold ml-2"> ${{ priceUSD }} </span>
            </div>
          </div>

          <div
            class="flex justify-between has-text-grey pb-4 mt-3 border-b-k-shade">
            <span>{{ $t('listingCart.listingFees') }}</span>
            <span class="ml-2">{{ teleportTransitionTxFees }}</span>
          </div>
        </div>

        <div class="flex justify-between px-6">
          <AutoTeleportActionButton
            ref="autoteleportButton"
            :actions="actions"
            :disabled="Boolean(listingCartStore.incompleteListPrices)"
            :fees="{ actionLazyFetch: true }"
            :label="confirmListingLabel"
            @confirm="confirm" />
        </div>
      </ModalBody>
    </NeoModal>
  </div>
</template>

<script setup lang="ts">
import { Interaction } from '@kodadot1/minimark/v1'
import { prefixToToken } from '@/components/common/shoppingCart/utils'
import { NeoModal } from '@kodadot1/brick'
import ModalBody from '@/components/shared/modals/ModalBody.vue'
import { usePreferencesStore } from '@/stores/preferences'
import { TokenToList } from '@/composables/transaction/types'
import { ListCartItem, useListingCartStore } from '@/stores/listingCart'
import format, { calculateBalance } from '@/utils/format/balance'
import { warningMessage } from '@/utils/notification'
import { useFiatStore } from '@/stores/fiat'
import { calculateExactUsdFromToken } from '@/utils/calculation'
import { sum } from '@/utils/math'
import ModalIdentityItem from '@/components/shared/ModalIdentityItem.vue'
import AutoTeleportActionButton, {
  type AutoTeleportActionButtonConfirmEvent,
} from '@/components/common/autoTeleport/AutoTeleportActionButton.vue'
import ListingCartSingleItemCart from './singleItemCart/ListingCartSingleItemCart.vue'
import ListingCartMultipleItemsCart from './multipleItemsCart/ListingCartMultipleItemsCart.vue'
import type { Actions } from '@/composables/transaction/types'
import type { AutoTeleportAction } from '@/composables/autoTeleport/types'

const { urlPrefix } = usePrefix()
const preferencesStore = usePreferencesStore()
const listingCartStore = useListingCartStore()
const { $i18n } = useNuxtApp()
const { transaction, isLoading, status, isError, blockNumber } =
  useTransaction()

const { chainSymbol, decimals } = useChain()

const fixedPrice = ref()
const floorPricePercentAdjustment = ref()
const autoTeleport = ref(false)
const autoteleportButton = ref()

const loadingAutoTeleport = computed(() => !autoteleportButton.value?.isReady)

const teleportTransitionTxFees = computed(() =>
  format(
    autoteleportButton.value?.optimalTransition.txFees || 0,
    decimals.value,
    chainSymbol.value,
  ),
)

function setFixedPrice() {
  const rate = Number(fixedPrice.value) || 0

  listingCartStore.setFixedPrice(rate)
}

watch(floorPricePercentAdjustment, (rate) => {
  listingCartStore.setFloorPrice(rate)
})

const fiatStore = useFiatStore()
const action = ref<Actions>(emptyObject<Actions>())
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
      listingCartStore.itemsInChain.map((nft) => Number(nft.listPrice)),
    ).toFixed(4),
  ),
)

const cartHasNFTsWithPrice = computed(() =>
  listingCartStore.itemsInChain.map((nft) => Number(nft.price)).some(Boolean),
)
const showChangePriceModal = computed(
  () => cartHasNFTsWithPrice.value && listingCartStore.count === 1,
)

const title = computed(() => {
  const items =
    listingCartStore.count === 1
      ? 'NFT'
      : `${listingCartStore.count} ${$i18n.t('items')}`

  return showChangePriceModal.value
    ? $i18n.t('transaction.price.change')
    : `List ${items}`
})

const confirmListingLabel = computed(() => {
  switch (listingCartStore.incompleteListPrices) {
    case 0:
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

const getAction = (items: ListCartItem[]): Actions => {
  const token = items
    .filter((item): item is ListCartItem & { listPrice: number } =>
      Boolean(item.listPrice),
    )
    .map((item) => ({
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

async function confirm({ autoteleport }: AutoTeleportActionButtonConfirmEvent) {
  try {
    autoTeleport.value = autoteleport

    if (!autoteleport) {
      await transaction(getAction(listingCartStore.itemsInChain))
    }

    listingCartStore.clearListedItems()
    preferencesStore.listingCartModalOpen = false
    resetCartToDefaults()
  } catch (error) {
    warningMessage(error)
  }
}

const onClose = () => {
  resetCartToDefaults()
  preferencesStore.listingCartModalOpen = false
}

const resetCartToDefaults = () => {
  fixedPrice.value = undefined
  floorPricePercentAdjustment.value = undefined
}

watch(
  () => listingCartStore.count,
  () => {
    if (listingCartStore.count === 0) {
      preferencesStore.listingCartModalOpen = false
    }
  },
)

watch(
  () => preferencesStore.listingCartModalOpen,
  (listingCartModalOpen) => {
    if (!listingCartModalOpen) {
      listingCartStore.clearDiscardedItems()
    }
  },
)

watchSyncEffect(() => {
  if (!autoTeleport.value) {
    action.value = getAction(listingCartStore.itemsInChain)
  }
})

onUnmounted(() => {
  preferencesStore.listingCartModalOpen = false
})
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.rounded {
  border-radius: 10rem;
}

.limit-height {
  max-height: 50vh;
  overflow-y: auto;
}

:deep(.identity-name-font-weight-regular) {
  .identity-name {
    font-weight: unset !important;
  }
}
</style>
