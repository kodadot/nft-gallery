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
import _ from 'lodash'

const { transaction, status, isLoading, isError, blockNumber } =
  useTransaction()
const { urlPrefix } = usePrefix()
const shoppingCartStore = useShoppingCartStore()
const preferencesStore = usePreferencesStore()
const fiatStore = useFiatStore()

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
  const isNotListed = newPrice === '0'

  if (item.price === newPrice) {
    return
  }

  if (isShoppingCartMode.value) {
    if (isNotListed) {
      shoppingCartStore.removeItem(item.id)
    } else {
      shoppingCartStore.updateItem({
        ...item,
        price: newPrice,
      })
    }
  } else {
    if (isNotListed) {
      shoppingCartStore.removeItemToBuy()
    } else {
      shoppingCartStore.setItemToBuy({
        ...item,
        price: newPrice,
      })
    }
  }
}

const watchNftChanges = (nftIds: string[]) => {
  if (_.isEqual(nftIds, nftSubscription.nftIds)) {
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
  [() => shoppingCartStore.getItemToBuy, items],
  () => {
    const nftIds = (
      isShoppingCartMode.value
        ? items.value.map((item) => item.id)
        : [shoppingCartStore.itemToBuy?.id]
    ).filter(Boolean) as string[]

    if (nftIds.length) {
      watchNftChanges(nftIds)
    }
  },
  { immediate: true },
)
</script>
