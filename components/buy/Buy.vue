<template>
  <div>
    <ConfirmPurchaseModal @confirm="onConfirm" />
    <Loader v-model="isLoading" :status="status" />
  </div>
</template>

<script lang="ts" setup>
import { ShoppingActions } from '@/utils/shoppingActions'
import { useShoppingCartStore } from '@/stores/shoppingCart'
import { usePreferencesStore } from '@/stores/preferences'
import { useFiatStore } from '@/stores/fiat'

import { warningMessage } from '@/utils/notification'
import ConfirmPurchaseModal from '@/components/common/confirmPurchaseModal/ConfirmPurchaseModal.vue'
import Loader from '@/components/shared/Loader.vue'
import { TokenToBuy } from '@/composables/transaction/types'
import { ShoppingCartItem } from '@/components/common/shoppingCart/types'
const { urlPrefix } = usePrefix()
const shoppingCartStore = useShoppingCartStore()
const preferencesStore = usePreferencesStore()
const fiatStore = useFiatStore()

const items = computed(() =>
  shoppingCartStore.getItemsByPrefix(urlPrefix.value),
)

onMounted(async () => {
  if (
    fiatStore.getCurrentKSMValue === null ||
    fiatStore.getCurrentDOTValue === null ||
    fiatStore.getCurrentBSXValue === null
  ) {
    fiatStore.fetchFiatPrice()
  }
})

const { transaction, status, isLoading } = useTransaction()
const { $i18n } = useNuxtApp()

const ShoppingCartItemToTokenToBuy = (item: ShoppingCartItem): TokenToBuy => {
  return {
    currentOwner: item.currentOwner,
    price: item.price,
    id: item.id,
    royalty: item.royalty,
  }
}

watchEffect(() => {
  if (
    isLoading.value === false &&
    status.value === TransactionStatus.Finalized
  ) {
    preferencesStore.setTriggerBuySuccess(true)
    shoppingCartStore.clear()
  }
})

const onConfirm = () => {
  if (preferencesStore.getCompletePurchaseModal.mode === 'shopping-cart') {
    handleBuy(items.value.map(ShoppingCartItemToTokenToBuy))
  } else {
    handleBuy(
      ShoppingCartItemToTokenToBuy(
        shoppingCartStore.getItemToBuy as ShoppingCartItem,
      ),
    )
    shoppingCartStore.removeItemToBuy()
  }
}

const handleBuy = async (nfts: TokenToBuy | TokenToBuy[]) => {
  try {
    await transaction({
      interaction: ShoppingActions.BUY,
      nfts,
      urlPrefix: urlPrefix.value,
      successMessage: $i18n.t('mint.successNewNfts'),
      errorMessage: $i18n.t('transaction.buy.error'),
    })
  } catch (error) {
    warningMessage(error)
  }
}
</script>
