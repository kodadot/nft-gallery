<template>
  <div>
    <SigningModal
      v-if="!usingAutoTeleport"
      :title="$t('buyModal.buyingNft', buySessionItems.length)"
      :is-loading="isLoading"
      :status="status"
      @try-again="handleBuy" />

    <BuySuccessfulBuyModal
      v-model="isSuccessfulModalOpen"
      :tx-hash="txHash"
      :items="buySessionItems" />

    <ConfirmPurchaseModal
      :loading="!hasSyncedPrices"
      :action="autoteleportAction"
      @close="handleClose"
      @confirm="handleConfirm"
      @completed="handleActionCompleted" />
  </div>
</template>

<script lang="ts" setup>
import { useShoppingCartStore } from '@/stores/shoppingCart'
import { usePreferencesStore } from '@/stores/preferences'
import { useFiatStore } from '@/stores/fiat'

import ConfirmPurchaseModal from '@/components/common/confirmPurchaseModal/ConfirmPurchaseModal.vue'
import { Actions, TokenToBuy } from '@/composables/transaction/types'
import { ShoppingCartItem } from '@/components/common/shoppingCart/types'
import { AutoTeleportActionButtonConfirmEvent } from '@/components/common/autoTeleport/AutoTeleportActionButton.vue'
import { warningMessage } from '@/utils/notification'
import type { AutoTeleportAction } from '@/composables/autoTeleport/types'
import isEqual from 'lodash/isEqual'

type ConfirmPurchaseParams = {
  items: ShoppingCartItem[]
} & AutoTeleportActionButtonConfirmEvent

const { transaction, status, isLoading, isError, blockNumber, txHash } =
  useTransaction()
const { urlPrefix } = usePrefix()
const shoppingCartStore = useShoppingCartStore()
const preferencesStore = usePreferencesStore()
const fiatStore = useFiatStore()
const { toast } = useToast()
const { $i18n } = useNuxtApp()

const nftSubscription = reactive<{
  unsubscribe: () => void
  nftIds: string[]
}>({ unsubscribe: () => ({}), nftIds: [] })

const hasSyncedPrices = ref(false)
const usingAutoTeleport = ref(false)
const buyAction = ref<Actions>(emptyObject<Actions>())
const buySessionItems = ref<ShoppingCartItem[]>([])
const isSuccessfulModalOpen = ref(false)

const autoteleportAction = computed<AutoTeleportAction>(() => ({
  action: buyAction.value,
  transaction: transaction,
  details: {
    status: status.value,
    isLoading: isLoading.value,
    isError: isError.value,
    blockNumber: blockNumber.value,
  },
}))

const isTransactionCompleted = computed(
  () => Boolean(txHash.value) && !isLoading.value,
)
const isSimpleTransactionCompleted = computed(
  () => isTransactionCompleted.value && !usingAutoTeleport.value,
)

const items = computed(() =>
  shoppingCartStore.getItemsByPrefix(urlPrefix.value),
)

const isShoppingCartMode = computed(
  () => preferencesStore.getCompletePurchaseModal.mode === 'shopping-cart',
)

const ShoppingCartItemToTokenToBuy = (item: ShoppingCartItem): TokenToBuy => {
  return {
    currentOwner: item?.currentOwner,
    price: item?.price,
    id: item?.id,
    royalty: item?.royalty,
  }
}

const handleClose = () => {
  usingAutoTeleport.value = false
}

const openSuccessModal = () => {
  isSuccessfulModalOpen.value = true
}

const clearNftSubscription = () => {
  nftSubscription.unsubscribe()
  nftSubscription.nftIds = []
}

const handleActionCompleted = () => {
  openSuccessModal()

  clearNftSubscription()
  preferencesStore.setTriggerBuySuccess(true)
  shoppingCartStore.clear()
  handleClose()
}

const handleConfirm = async ({
  autoteleport,
  items: nfts,
}: ConfirmPurchaseParams) => {
  usingAutoTeleport.value = autoteleport
  buySessionItems.value = nfts

  if (!isShoppingCartMode.value) {
    shoppingCartStore.removeItemToBuy()
  }

  if (!autoteleport) {
    await handleBuy()
  }
}

const getCartModeBasedBuyAction = () => {
  if (isShoppingCartMode.value) {
    return getBuyAction(
      items.value.map(ShoppingCartItemToTokenToBuy),
      items.value.map((item) => item.name),
    )
  } else {
    const item = shoppingCartStore.getItemToBuy as ShoppingCartItem
    return getBuyAction(ShoppingCartItemToTokenToBuy(item), [item?.name || ''])
  }
}

const getBuyAction = (
  nfts: TokenToBuy | TokenToBuy[],
  nftNames: string[],
): Actions => {
  return {
    interaction: ShoppingActions.BUY,
    nfts,
    urlPrefix: urlPrefix.value,
    successMessage: $i18n.t('mint.successPurchasedNfts', [nftNames.join(', ')]),
    errorMessage: $i18n.t('transaction.buy.error'),
  }
}

const handleBuy = async () => {
  try {
    await transaction(buyAction.value)
  } catch (error) {
    warningMessage(error)
  }
}

const handleNftPriceChange = (
  item: ShoppingCartItem,
  updatedNft: { id: string; price: string },
) => {
  const newPrice = updatedNft.price
  const isNotListedAnymore = newPrice === '0'

  if (item.price === newPrice && !isNotListedAnymore) {
    return
  }

  const name = nftSubscription.nftIds.length > 1 ? item.name : ''

  if (isNotListedAnymore) {
    if (isShoppingCartMode.value) {
      shoppingCartStore.removeItem(item.id)
    } else {
      shoppingCartStore.removeItemToBuy()
    }
    nftSubscription.nftIds = nftSubscription.nftIds.filter(
      (id) => item.id !== id,
    )
    return toast($i18n.t('buyModal.nftNotListedAnymore', [name]))
  }

  if (isShoppingCartMode.value) {
    shoppingCartStore.updateItem({
      ...item,
      price: newPrice,
    })
  } else {
    shoppingCartStore.setItemToBuy({
      ...item,
      price: newPrice,
    })
  }

  toast($i18n.t('buyModal.nftPriceUpdated', [name]))
}

const watchNftsPriceChanges = (nftIds: string[], force: boolean = false) => {
  if (isEqual(nftIds, nftSubscription.nftIds) && !force) {
    return
  }

  hasSyncedPrices.value = false
  nftSubscription.unsubscribe()
  nftSubscription.nftIds = nftIds

  nftSubscription.unsubscribe = useSubscriptionGraphql({
    query: `nftEntities(where: {
        id_in: ${JSON.stringify(nftIds)}
    }) {
      id
      price
    }`,
    onChange: ({ data: { nftEntities: updatedNfts } }) => {
      updatedNfts.forEach((updatedNft) => {
        const item = isShoppingCartMode.value
          ? items.value.find((item) => item.id === updatedNft.id)
          : shoppingCartStore.itemToBuy

        if (item) {
          handleNftPriceChange(item, updatedNft)
        }
      })

      hasSyncedPrices.value = true
    },
  })
}

watch(
  [
    () => preferencesStore.completePurchaseModal.isOpen,
    () => shoppingCartStore.getItemToBuy,
    items,
  ],
  ([isModalOpen], [wasModalOpen]) => {
    const nftIds = (
      isShoppingCartMode.value
        ? items.value.map((item) => item.id)
        : [shoppingCartStore.itemToBuy?.id]
    ).filter(Boolean) as string[]

    if (isModalOpen && nftIds.length === 0) {
      preferencesStore.completePurchaseModal.isOpen = false
      return
    }

    const listenNftsPriceChanges =
      nftIds.length && !isTransactionCompleted.value

    if (listenNftsPriceChanges) {
      watchNftsPriceChanges(nftIds, isModalOpen && !wasModalOpen)
    }
  },
  { immediate: true },
)

watch(isSimpleTransactionCompleted, (completed: boolean) => {
  if (completed) {
    handleActionCompleted()
  }
})

watch(
  () => preferencesStore.completePurchaseModal.isOpen,
  (isOpen, prevIsOpen) => {
    if (isOpen && !prevIsOpen) {
      buyAction.value = getCartModeBasedBuyAction()
    }
  },
  { immediate: true },
)

onMounted(async () => {
  if (fiatStore.incompleteFiatValues) {
    fiatStore.fetchFiatPrice()
  }
})
</script>
