<template>
  <div>
    <Loader v-if="!usingAutoTeleport" v-model="isLoading" :status="status" />
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

import Loader from '@/components/shared/Loader.vue'
import ConfirmPurchaseModal from '@/components/common/confirmPurchaseModal/ConfirmPurchaseModal.vue'
import { Actions, TokenToBuy } from '@/composables/transaction/types'
import { ShoppingCartItem } from '@/components/common/shoppingCart/types'
import { AutoTeleportActionButtonConfirmEvent } from '@/components/common/autoTeleport/AutoTeleportActionButton.vue'
import { warningMessage } from '@/utils/notification'
import type { AutoTeleportAction } from '@/composables/autoTeleport/types'
import isEqual from 'lodash/isEqual'

const { transaction, status, isLoading, isError, blockNumber } =
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

const items = computed(() =>
  shoppingCartStore.getItemsByPrefix(urlPrefix.value),
)

onMounted(async () => {
  if (fiatStore.incompleteFiatValues) {
    fiatStore.fetchFiatPrice()
  }
})

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

const handleActionCompleted = () => {
  nftSubscription.unsubscribe()
  preferencesStore.setTriggerBuySuccess(true)
  shoppingCartStore.clear()
  handleClose()
}

const handleConfirm = async ({
  autoteleport,
}: AutoTeleportActionButtonConfirmEvent) => {
  usingAutoTeleport.value = autoteleport

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
  const firstNftId = Array.isArray(nfts) ? nfts[0].id : nfts.id

  return {
    interaction: ShoppingActions.BUY,
    nfts,
    urlPrefix: urlPrefix.value,
    successMessage: {
      message: $i18n.t('mint.successPurchasedNfts', [nftNames.join(', ')]),
      large: true,
      shareLink: `${window.location.origin}/${urlPrefix.value}/gallery/${firstNftId}`,
    },
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

watch(
  () => preferencesStore.completePurchaseModal.isOpen,
  (isOpen, prevIsOpen) => {
    if (isOpen && !prevIsOpen) {
      buyAction.value = getCartModeBasedBuyAction()
    }
  },
  { immediate: true },
)

const handleNftChange = (
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

const watchNftsChanges = (nftIds: string[]) => {
  if (isEqual(nftIds, nftSubscription.nftIds)) {
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
          handleNftChange(item, updatedNft)
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
  ([isModalOpen]) => {
    const nftIds = (
      isShoppingCartMode.value
        ? items.value.map((item) => item.id)
        : [shoppingCartStore.itemToBuy?.id]
    ).filter(Boolean) as string[]

    if (isModalOpen && nftIds.length === 0) {
      preferencesStore.completePurchaseModal.isOpen = false
      return
    }

    if (nftIds.length) {
      watchNftsChanges(nftIds)
    }
  },
  { immediate: true },
)
</script>
