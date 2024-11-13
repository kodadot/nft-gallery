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
      :query
      :selectable="swap.desired.length !== swap.offered.length"
      with-filters
    />

    <template #preview>
      <SwapPreview />
    </template>
  </SwapLayoutSelection>
</template>

<script setup lang="ts">
const { accountId } = useAuth()
const { swap } = storeToRefs(useAtomicSwapsStore())

const query = reactive({
  currentOwner_eq: accountId.value,
  burned_eq: false,
})
</script>
