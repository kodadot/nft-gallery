<template>
  <SwapLayoutSelection>
    <template #title>
      <SwapBannerTitle
        step="3/4"
        :title="$t('swap.selectOffer')"
        :subtitle="$t('swap.selectOfferSubtitle')"
      />
    </template>

    <SwapGridList
      v-if="accountId"
      :query
      :selectable="swap.desired.length !== swap.offered.length"
      with-filters
    />

    <template #preview>
      <SwapPreview :step="SwapStep.OFFERED" />
    </template>
  </SwapLayoutSelection>
</template>

<script setup lang="ts">
import { SwapStep } from '@/components/swap/types'

const { accountId } = useAuth()
const { swap } = storeToRefs(useAtomicSwapStore())

const query = computed(() => ({
  currentOwner_eq: accountId.value,
  burned_eq: false,
}))
</script>
