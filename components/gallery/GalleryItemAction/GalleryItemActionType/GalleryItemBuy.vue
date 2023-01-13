<template>
  <div>
    <Loader v-model="isLoading" :status="status" />
    <GalleryItemPriceSection v-if="nftPrice" title="Price" :price="nftPrice">
      <GalleryItemActionSlides
        v-if="Number(nftPrice)"
        ref="actionRef"
        :active="active"
        :disabled="disabled">
        <template #action>
          <NeoTooltip
            :active="disabled"
            :label="$t('tooltip.notEnoughBalance')">
            <NeoButton
              :label="`${label}`"
              size="large"
              fixed-width
              variant="k-accent"
              :disabled="disabled"
              no-shadow
              @click.native="onClick" />
          </NeoTooltip>
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
import { notificationTypes, showNotification } from '@/utils/notification'
import { getApiCall } from '@/utils/gallery/abstractCalls'
import { getKusamaAssetId } from '@/utils/api/bsx/query'
import { somePercentFromTX } from '@/utils/support'
import { tokenIdToRoute } from '@/components/unique/utils'
import { JustInteraction, createInteraction } from '@kodadot1/minimark'
import nftByIdMinimal from '@/queries/rmrk/subsquid/nftByIdMinimal.graphql'
import useRmrkVersion from '@/composables/useRmrkVersion'
const props = withDefaults(
  defineProps<{
    nftId: string
    currentOwner?: string
    collectionId?: string
    nftPrice?: string
  }>(),
  {
    nftId: '',
    currentOwner: '',
    collectionId: '',
    nftPrice: '',
  }
)

const { urlPrefix, client } = usePrefix()
const { accountId } = useAuth()
const { $store, $apollo, $i18n } = useNuxtApp()
const { apiInstance } = useApi()
const emit = defineEmits(['buy-success'])
const ACTION = 'BUY'
const actionLabel = $i18n.t('nft.action.buy')

const { howAboutToExecute, initTransactionLoader, isLoading, status } =
  useMetaTransaction()

const active = ref(false)
const label = computed(() =>
  active.value ? $i18n.t('nft.action.confirm') : $i18n.t('nft.action.buy')
)

const balance = computed<string>(() => {
  if (urlPrefix.value == 'rmrk') {
    return $store.getters.getAuthBalance
  }
  return $store.getters.getTokenBalanceOf(getKusamaAssetId(urlPrefix.value))
})
const disabled = computed(() => {
  if (!(props.nftPrice && balance.value)) {
    return false
  }
  return Number(balance.value) <= Number(props.nftPrice)
})

function onClick() {
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

const getTranasactionParams = async () => {
  const api = await apiInstance.value
  if (urlPrefix.value == 'rmrk') {
    const rmrk = createInteraction(
      ACTION as JustInteraction,
      useRmrkVersion().version,
      props.nftId,
      ''
    )
    return {
      cb: api.tx.utility.batchAll,
      arg: [
        [
          api.tx.system.remark(rmrk),
          api.tx.balances.transfer(props.currentOwner, props.nftPrice),
          somePercentFromTX(api, props.nftPrice),
        ],
      ],
    }
  }

  // not RMRK
  const { id: collectionId, item: itemId } = tokenIdToRoute(props.nftId)
  return {
    cb: getApiCall(api, urlPrefix.value, ACTION),
    arg: [collectionId, itemId],
  }
}
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
      }) as string,
      notificationTypes.warn
    )
    return false
  }
  return true
}

const handleBuy = async () => {
  const { item: itemId } = tokenIdToRoute(props.nftId)
  const { cb, arg } = await getTranasactionParams()

  showNotification(
    $i18n.t('nft.notification.info', { itemId, action: actionLabel }) as string
  )

  if (urlPrefix.value === 'rmrk' && !(await checkBuyBeforeSubmit())) {
    return
  }

  initTransactionLoader()
  howAboutToExecute(accountId.value, cb, arg, (blockNumber: string) => {
    showNotification(blockNumber, notificationTypes.info)
    showNotification(`[${actionLabel}] ${itemId}`, notificationTypes.success)
    emit('buy-success')
  })
}

const actionRef = ref(null)
onClickOutside(actionRef, () => (active.value = false))
</script>
