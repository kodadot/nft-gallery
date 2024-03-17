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
}>({ unsubscribe: () => ({}) })

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

const shoppingItems = computed<ShoppingCartItem[]>(() =>
  isShoppingCartMode.value
    ? items.value
    : ([shoppingCartStore.itemToBuy].filter(Boolean) as ShoppingCartItem[]),
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
  stopListeningNftPriceChanges()
}

const openSuccessModal = () => {
  isSuccessfulModalOpen.value = true
}

const stopListeningNftPriceChanges = () => {
  nftSubscription.unsubscribe()
}

const handleActionCompleted = () => {
  openSuccessModal()

  preferencesStore.setTriggerBuySuccess(true)
  shoppingCartStore.clear()
  handleClose()
}

const handleConfirm = async ({
  autoteleport,
  items: nfts,
}: ConfirmPurchaseParams) => {
  stopListeningNftPriceChanges()
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

const removeItem = (id: string) => {
  if (isShoppingCartMode.value) {
    shoppingCartStore.removeItem(id)
  } else {
    shoppingCartStore.removeItemToBuy()
  }
}

const updateItem = (item: ShoppingCartItem, price: string) => {
  if (isShoppingCartMode.value) {
    shoppingCartStore.updateItem({
      ...item,
      price,
    })
  } else {
    shoppingCartStore.setItemToBuy({
      ...item,
      price,
    })
  }
}

const handleNftPriceChange = (
  item: ShoppingCartItem,
  updatedNft: { id: string; price: string },
): boolean => {
  const newPrice = updatedNft.price
  const isNotListedAnymore = newPrice === '0'

  if (item.price === newPrice && !isNotListedAnymore) {
    return false
  }

  const name = shoppingItems.value.length > 1 ? item.name : ''

  if (isNotListedAnymore) {
    removeItem(item.id)
    toast($i18n.t('buyModal.nftNotListedAnymore', [name]))
  } else {
    updateItem(item, newPrice)
    toast($i18n.t('buyModal.nftPriceUpdated', [name]))
  }

  return true
}

const subscribeToNftPriceChange = (nftIds: string[]) => {
  hasSyncedPrices.value = false
  nftSubscription.unsubscribe = useSubscriptionGraphql({
    query: `nftEntities(where: {
        id_in: ${JSON.stringify(nftIds)}
    }) {
      id
      price
    }`,
    onChange: ({ data: { nftEntities: updatedNfts } }) => {
      updatedNfts.forEach((updatedNft) => {
        const item = shoppingItems.value.find(
          (item) => item.id === updatedNft.id,
        )

        if (item) {
          const priceChanged = handleNftPriceChange(item, updatedNft)
          if (priceChanged) {
            syncBuyAction()
          }
        }
      })

      hasSyncedPrices.value = true
    },
  })
}

const syncBuyAction = () => {
  buyAction.value = getCartModeBasedBuyAction()
}

watch(
  () => preferencesStore.completePurchaseModal.isOpen,
  (isOpen, prevIsOpen) => {
    const modalGotOpened = isOpen && !prevIsOpen
    if (modalGotOpened) {
      syncBuyAction()

      const nftIds = shoppingItems.value.map((item) => item.id)
      if (nftIds.length) {
        subscribeToNftPriceChange(nftIds)
      }
    }
  },
)

watch(shoppingItems, (items: ShoppingCartItem[]) => {
  if (preferencesStore.completePurchaseModal.isOpen && items.length === 0) {
    preferencesStore.completePurchaseModal.isOpen = false
  }
})

watch(isSimpleTransactionCompleted, (completed: boolean) => {
  if (completed) {
    handleActionCompleted()
  }
})

onMounted(async () => {
  if (fiatStore.incompleteFiatValues) {
    fiatStore.fetchFiatPrice()
  }
})
</script>
