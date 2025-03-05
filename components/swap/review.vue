<template>
  <SwapLayout class="pb-[100px]">
    <template #title>
      <SwapBannerTitle
        step="4/4"
        :title="$t('swap.reviewOffer')"
        :subtitle="$t('swap.reviewCheckAssets')"
      />
    </template>

    <div>
      <hr class="mb-14 mt-0">

      <div class="flex flex-col md:flex-row">
        <div class="flex-1">
          <div class="flex items-center">
            <div class="title mb-0">
              {{ $t('swap.youOffer') }}
            </div>
            <img
              src="~/assets/svg/swap/arrow-up.svg"
              alt="Swap offer"
            >
          </div>
          <p class="h-12">
            {{ $t('swap.reviewSelected') }}
          </p>

          <SwapGridList
            :query="offeredQuery"
            class="!my-10"
            :surcharge="surcharge?.direction === 'Send' ? surcharge : undefined"
          />
        </div>

        <div class="hidden md:flex md:items-center">
          <NeoIcon
            class="pt-8 px-4"
            icon="arrow-right-arrow-left"
            size="large"
          />
        </div>

        <div class="flex-1">
          <div class="flex items-center">
            <div class="title mb-0">
              {{ $t('swap.youWillReceive') }}
            </div>
            <img
              src="~/assets/svg/swap/arrow-down.svg"
              alt="Swap Receive"
            >
          </div>
          <p class="h-12">
            {{ $t('swap.reviewCounterpartyAccept') }}
          </p>

          <SwapCollectionSwapGridList
            v-if="swap.isCollectionSwap"
          />
          <SwapGridList
            v-else
            :query="desiredQuery"
            class="!my-10"
            :surcharge="surcharge?.direction === 'Receive' ? surcharge : undefined"
          />
        </div>
      </div>
    </div>
  </SwapLayout>
  <div class="fixed bottom-0 left-0 right-0 bg-background-color z-[100]">
    <hr class="m-0">

    <div
      class="container is-fluid flex flex-col gap-6 justify-between items-center !my-6 md:flex-row md:my-[3.5rem]"
    >
      <div class="w-[300px]">
        <TradeExpirationSelector
          v-model="swap.duration"
          position="auto"
          custom-menu-class="!ml-[168px]"
          class="pt-2"
        />
      </div>

      <div class="flex gap-8 justify-end">
        <NeoButton
          class="!px-10"
          size="large"
          no-shadow
          :label="$t('swap.modifyOffer')"
          @click="onModifyOfferClick"
        />

        <NeoButton
          class="!px-10"
          variant="primary"
          no-shadow
          size="large"
          :label="$t('swap.submit')"
          @click="submit"
        />
      </div>
    </div>
  </div>

  <SigningModal
    :title="$t('swap.creatingSwap')"
    :is-loading="isLoading"
    :status="status"
    @try-again="submit"
  />
</template>

<script setup lang="ts">
import { NeoIcon, NeoButton } from '@kodadot1/brick'
import { successMessage } from '@/utils/notification'
import { SwapStep } from '@/components/swap/types'

const router = useRouter()
const { $i18n } = useNuxtApp()
const { transaction, isLoading, status, blockNumber } = useTransaction({ disableSuccessNotification: true })
const { urlPrefix } = usePrefix()
const { accountId } = useAuth()
const swapStore = useAtomicSwapStore()
const { swap } = storeToRefs(swapStore)

const offeredQuery = computed(() => ({ id_in: swap.value?.offered.map(item => item.id) }))
const desiredQuery = computed(() => ({ id_in: swap.value?.desired.map(item => item.id) }))

const toTokenToSwap = (item: SwapItem) => ({
  id: item.id,
  collectionId: item.collectionId,
  sn: item.sn,
})

const surcharge = computed(() => swap.value?.surcharge)

const onModifyOfferClick = () => {
  router.push({ name: getSwapStepRouteName(SwapStep.DESIRED, swap.value?.isCollectionSwap), params: { id: swap.value?.counterparty }, query: { swapId: swap.value?.id } })
}

const submit = () => {
  if (!swap.value) {
    return
  }

  transaction({
    interaction: ShoppingActions.CREATE_SWAP,
    offered: swap.value.offered.map(toTokenToSwap),
    desired: swap.value.desired.map(toTokenToSwap),
    duration: swap.value.duration,
    surcharge: surcharge.value,
    urlPrefix: urlPrefix.value,
  })
}

watch([status, blockNumber], () => {
  if (status.value === TransactionStatus.Finalized && blockNumber.value) {
    successMessage($i18n.t('swap.created'), {
      footer: { icon: 'circle-info', label: $i18n.t('general.updateOnWebsiteSoon') },
    })
    swapStore.updateSwap({ blockNumber: blockNumber.value })
    navigateTo(`/${urlPrefix.value}/u/${accountId.value}?tab=swaps&filter=outgoing`)
  }
})
</script>
