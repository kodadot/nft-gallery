<template>
  <SwapLayout>
    <template #title>
      <SwapBannerTitle
        step="4/4"
        :title="$t('swap.reviewOffer')"
        :subtitle="$t('swap.reviewCheckAssets')"
      />
    </template>

    <div>
      <hr class="mb-14 mt-0">

      <div class="columns">
        <div class="column">
          <div class="flex items-center">
            <div class="title mb-0">
              {{ $t('swap.youOffer') }}
            </div>
            <img
              src="~/assets/svg/swap/arrow-up.svg"
              alt="Swap offer"
            >
          </div>
          <p>
            {{ $t('swap.reviewSelected') }}
          </p>

          <SwapGridList
            :query="offeredQuery"
            class="!my-10"
          />
        </div>
        <div class="column is-narrow flex items-center">
          <NeoIcon
            class="pt-8 px-4"
            icon="arrow-right-arrow-left"
            size="large"
          />
        </div>
        <div class="column">
          <div class="flex items-center">
            <div class="title mb-0">
              {{ $t('swap.youWillReceive') }}
            </div>
            <img
              src="~/assets/svg/swap/arrow-down.svg"
              alt="Swap Receive"
            >
          </div>
          <p>
            {{ $t('swap.reviewCounterpartyAccept') }}
          </p>

          <SwapGridList
            :query="desiredQuery"
            class="!my-10"
          />
        </div>
      </div>

      <div
        class="flex justify-between items-center my-[3.5rem]"
      >
        <div class="w-[300px]">
          <OfferExpirationSelector
            v-model="swap.duration"
            position="auto"
            class="pt-2"
          />
        </div>

        <div class="flex gap-8 justify-end">
          <NeoButton
            class="!px-10"
            size="large"
            :label="$t('swap.modifyOffer')"
            @click="router.push({ name: 'prefix-swap-id', params: { id: swap.counterparty }, query: { swapId: swap.id } })"
          />

          <NeoButton
            class="!px-10"
            variant="primary"
            size="large"
            :label="$t('swap.submit')"
            @click="submit"
          />
        </div>
      </div>
    </div>
  </SwapLayout>

  <SigningModal
    :title="$t('swap.creatingSwap')"
    :is-loading="isLoading"
    :status="status"
    @try-again="submit"
  />
</template>

<script setup lang="ts">
import { NeoIcon, NeoButton } from '@kodadot1/brick'
import { SwapStep } from '@/components/swap/types'

const router = useRouter()
const { $i18n } = useNuxtApp()
const { transaction, isLoading, status, isError, blockNumber } = useTransaction()
const { urlPrefix } = usePrefix()
const swapsStore = useAtomicSwapsStore()
const { swap } = storeToRefs(swapsStore)

const offeredQuery = computed(() => ({ id_in: swap.value?.offered.map(item => item.id) }))
const desiredQuery = computed(() => ({ id_in: swap.value?.desired.map(item => item.id) }))

const toTokenToSwap = (item: SwapItem) => ({
  id: item.id,
  collectionId: item.collectionId,
  sn: item.sn,
})

const submit = () => {
  if (!swap.value) {
    return
  }

  transaction({
    interaction: ShoppingActions.CREATE_SWAP,
    offered: swap.value.offered.map(toTokenToSwap),
    desired: swap.value.desired.map(toTokenToSwap),
    duration: swap.value.duration,
    surcharge: swap.value.surcharge,
    urlPrefix: urlPrefix.value,
    successMessage: $i18n.t('swap.created'),
  })
}

watch(blockNumber, (blockNumber) => {
  if (blockNumber) {
    swap.value.blockNumber = blockNumber
  }
})

useTransactionTracker({
  transaction: { isError, status },
  onSuccess: async () => {
    await navigateTo({ name: getSwapStepRouteName(SwapStep.COUNTERPARTY) })
  },
  waitFor: [computed(() => Boolean(swap.value.blockNumber))],
})
</script>
