<template>
  <div data-cy="item-section-buy">
    <Loader v-model="isLoading" :status="status" />
    <GalleryItemPriceSection
      v-if="nftPrice"
      ref="root"
      title="Price"
      :price="nftPrice">
      <GalleryItemActionSlides
        v-if="Number(nftPrice)"
        ref="actionRef"
        :active="active"
        :class="{ 'gallery-item-slides-entry': !active }"
        :disabled="disabled">
        <template #entry>
          <NeoTooltip
            v-if="!active"
            :active="disabled"
            :append-to-body="true"
            :label="$t('tooltip.notEnoughBalance')">
            <NeoButton
              :label="label"
              size="large"
              class="full-width-action-button"
              variant="k-accent"
              :disabled="disabled"
              no-shadow
              data-cy="item-buy"
              @click.native="onClick" />
          </NeoTooltip>
        </template>

        <template #action>
          <NeoButton
            :label="label"
            size="large"
            fixed-width
            variant="k-accent"
            :disabled="disabled"
            no-shadow
            data-cy="item-buy"
            @click.native="onClick" />
        </template>

        <template #content>
          <div class="has-text-centered">
            {{ $t('nft.buyNFTOn') }}
            <span class="has-text-weight-bold is-uppercase">{{
              urlPrefix
            }}</span>
          </div>
        </template>
      </GalleryItemActionSlides>
      <div v-else>{{ $t('nft.notListed') }}</div>
    </GalleryItemPriceSection>
  </div>
</template>

<script setup lang="ts">
import { NeoButton, NeoTooltip } from '@kodadot1/brick'
import GalleryItemPriceSection from '../GalleryItemActionSection.vue'
import GalleryItemActionSlides from '../GalleryItemActionSlides.vue'
import { onClickOutside } from '@vueuse/core'
import {
  notificationTypes,
  showNotification,
  warningMessage,
} from '@/utils/notification'
import { getKusamaAssetId } from '@/utils/api/bsx/query'
import { tokenIdToRoute } from '@/components/unique/utils'
import nftByIdMinimal from '@/queries/rmrk/subsquid/nftByIdMinimal.graphql'
import { ShoppingActions } from '@/utils/shoppingActions'
import { ConnectWalletModalConfig } from '@/components/common/ConnectWallet/useConnectWallet'
import { usePreferencesStore } from '@/stores/preferences'

import Vue from 'vue'

const props = withDefaults(
  defineProps<{
    nftId: string
    currentOwner?: string
    collectionId?: string
    nftPrice?: string
    royalty?: number
    recipient?: string
  }>(),
  {
    nftId: '',
    currentOwner: '',
    collectionId: '',
    nftPrice: '',
    royalty: 0,
    recipient: '',
  }
)

const { urlPrefix, client } = usePrefix()
const { accountId } = useAuth()
const root = ref<Vue<Record<string, string>>>()
const { $store, $apollo, $i18n, $buefy, $route } = useNuxtApp()
const preferencesStore = usePreferencesStore()

const emit = defineEmits(['buy-success'])
const actionLabel = $i18n.t('nft.action.buy')

const { transaction, status, isLoading } = useTransaction()
const connected = computed(() => Boolean(accountId.value))
const active = ref(false)
const label = computed(() =>
  active.value
    ? $i18n.t('nft.action.confirm')
    : $i18n.t(
        preferencesStore.getReplaceBuyNowWithYolo ? 'YOLO' : 'nft.action.buy'
      )
)

const balance = computed<string>(() => {
  if (['rmrk', 'ksm'].includes(urlPrefix.value)) {
    return $store.getters.getAuthBalance
  }
  return $store.getters.getTokenBalanceOf(getKusamaAssetId(urlPrefix.value))
})
const disabled = computed(() => {
  if (!(props.nftPrice && balance.value) || !connected.value) {
    return false
  }
  return Number(balance.value) <= Number(props.nftPrice)
})

function onClick() {
  if (!connected.value) {
    $buefy.modal.open({
      parent: root?.value,
      ...ConnectWalletModalConfig,
    })
    return
  }
  if (active.value) {
    handleBuy()
  } else {
    active.value = true
  }
}
// close the buy button when transaction loading is finsihed
watch(isLoading, (loading) => {
  active.value = loading
})

const checkBuyBeforeSubmit = async () => {
  const nft = await $apollo.query({
    query: nftByIdMinimal,
    client: client.value,
    variables: {
      id: props.nftId,
    },
  })

  const {
    data: { nft: nFTEntity },
  } = nft

  if (
    nFTEntity.currentOwner !== props.currentOwner ||
    nFTEntity.burned ||
    nFTEntity.price === 0 ||
    nFTEntity.price !== props.nftPrice
  ) {
    showNotification(
      $i18n.t('nft.notification.nftChanged', {
        chain: urlPrefix.value.toUpperCase(),
        action: actionLabel,
      }),
      notificationTypes.warn
    )
    return false
  }
  return true
}

const handleBuy = async () => {
  const { item: itemId } = tokenIdToRoute(props.nftId)

  showNotification(
    $i18n.t('nft.notification.info', { itemId, action: actionLabel })
  )

  if (urlPrefix.value === 'rmrk' && !(await checkBuyBeforeSubmit())) {
    return
  }

  try {
    transaction({
      interaction: ShoppingActions.BUY,
      currentOwner: props.currentOwner,
      price: props.nftPrice,
      nftId: $route.params.id,
      tokenId: $route.params.id,
      urlPrefix: urlPrefix.value,
      recipient: props.recipient,
      royalty: props.royalty,
      successMessage: $i18n.t('mint.successNewNfts'),
      errorMessage: $i18n.t('transaction.buy.error'),
    })
  } catch (error) {
    warningMessage(error)
  } finally {
    showNotification(`[${actionLabel}] ${itemId}`, notificationTypes.success)
    emit('buy-success')
  }
}

const actionRef = ref(null)
onClickOutside(actionRef, () => (active.value = false))
</script>
