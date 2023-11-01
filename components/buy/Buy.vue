<template>
  <div>
    <Loader v-if="!usingAutoTeleport" v-model="isLoading" :status="status" />
    <ConfirmPurchaseModal
      :action="autoteleportAction"
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
import { type AutoTeleportAction } from '@/composables/autoTeleport/useAutoTeleport'

const { transaction, status, isLoading, isError } = useTransaction()
const { urlPrefix } = usePrefix()
const shoppingCartStore = useShoppingCartStore()
const preferencesStore = usePreferencesStore()
const fiatStore = useFiatStore()

const usingAutoTeleport = ref(false)
const buyAction = ref<Actions>(emptyObject<Actions>())
const autoteleportAction = computed<AutoTeleportAction>(() => ({
  action: buyAction.value,
  transaction: transaction,
  details: {
    status,
    isLoading,
    isError,
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

const { $i18n } = useNuxtApp()

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

const handleActionCompleted = () => {
  preferencesStore.setTriggerBuySuccess(true)
  shoppingCartStore.clear()
}

const handleConfirm = async ({
  autoteleport,
}: AutoTeleportActionButtonConfirmEvent) => {
  if (!isShoppingCartMode.value) {
    shoppingCartStore.removeItemToBuy()
  }

  usingAutoTeleport.value = autoteleport

  if (!autoteleport) {
    await handleBuy()
  }
}

const getCartModeBasedBuyAction = () => {
  if (isShoppingCartMode.value) {
    return getBuyAction(
      items.value.map(ShoppingCartItemToTokenToBuy),
      items.value.map((item) => item?.name),
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
    successMessage: {
      message: $i18n.t('mint.successPurchasedNfts', [nftNames.join(', ')]),
      large: true,
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
  [() => shoppingCartStore.itemToBuy, items],
  ([itemToBuy, itemsInCart]) => {
    if (itemToBuy !== undefined || itemsInCart.length !== 0) {
      buyAction.value = getCartModeBasedBuyAction()
    }
  },
  { immediate: true },
)
</script>
