<template>
  <section class="pt-5 container is-fluid flex flex-col space-y-10">
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
  </section>
</template>

<script setup lang="ts">
import { NeoIcon } from '@kodadot1/brick'

const atomicSwapsStore = useAtomicSwapsStore()
const { swap } = storeToRefs(atomicSwapsStore)
const route = useRoute()

const offeredQuery = computed(() => ({ id_in: swap.value?.offered.map(item => item.id) }))
const desiredQuery = computed(() => ({ id_in: swap.value?.desired.map(item => item.id) }))
</script>
