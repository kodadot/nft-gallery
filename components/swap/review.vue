<template>
  <section
    v-if="swap"
    class="pt-5 container is-fluid flex flex-col space-y-10"
  >
    <div class="flex justify-between">
      <SwapBannerTitle
        step="4/4"
        :title="$t('swap.reviewOffer')"
        :subtitle="$t('swap.reviewCheckAssets')"
      />

      <SwapBannerAccounts :counterparty="String(route.params.id)" />
    </div>

    <hr class="mb-0">

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
      class="flex justify-between !my-[3.5rem]"
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
          @click="router.push({ name: 'prefix-swap-id', params: { id: counterparty } })"
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
  </section>

  <SigningModal
    title="Creating Swap"
    :is-loading="isLoading"
    :status="status"
    close-in-block
    @try-again="submit"
  />
</template>

<script setup lang="ts">
import { NeoIcon, NeoButton } from '@kodadot1/brick'

const route = useRoute()
const router = useRouter()
const { transaction, isLoading, status } = useTransaction()
const { urlPrefix } = usePrefix()
const { swap, counterparty } = storeToRefs(useAtomicSwapsStore())
const { decimals } = useChain()

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

  const surcharge = swap.value.surcharge

  transaction({
    interaction: ShoppingActions.CREATE_SWAP,
    offered: swap.value.offered.map(toTokenToSwap),
    desired: swap.value.desired.map(toTokenToSwap),
    duration: swap.value.duration,
    surcharge: surcharge ? { amount: String(Number(surcharge.amount) * Math.pow(10, decimals.value)), direction: surcharge.direction } : undefined,
    urlPrefix: urlPrefix.value,
  })
}
</script>
