<template>
  <div>
    <ConfirmPurchaseModal>
      <template #custom-action="{ label, disabled, amount }">
        <AutoTeleportActionButton
          :amount="amount"
          :label="label"
          :disabled="disabled"
          :action="buyAction"
          @confirm="handleConfirm"
          @action:completed="handleActionCompleted" />
      </template>
    </ConfirmPurchaseModal>
  </div>
</template>

<script lang="ts" setup>
import { useShoppingCartStore } from '@/stores/shoppingCart'
import { usePreferencesStore } from '@/stores/preferences'
import { useFiatStore } from '@/stores/fiat'

import ConfirmPurchaseModal from '@/components/common/confirmPurchaseModal/ConfirmPurchaseModal.vue'
import { Actions, TokenToBuy } from '@/composables/transaction/types'
import { ShoppingCartItem } from '@/components/common/shoppingCart/types'

const { urlPrefix } = usePrefix()
const shoppingCartStore = useShoppingCartStore()
const preferencesStore = usePreferencesStore()
const fiatStore = useFiatStore()

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

const buyAction = computed<Actions>(() => {
  if (isShoppingCartMode.value) {
    return getBuyAction(
      items.value.map(ShoppingCartItemToTokenToBuy),
      items.value.map((item) => item?.name),
    )
  } else {
    const item = shoppingCartStore.getItemToBuy as ShoppingCartItem
    return getBuyAction(ShoppingCartItemToTokenToBuy(item), [item?.name || ''])
  }
})

const handleConfirm = () => {
  if (!isShoppingCartMode.value) {
    shoppingCartStore.removeItemToBuy()
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
</script>
