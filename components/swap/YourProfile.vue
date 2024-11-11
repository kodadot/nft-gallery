<template>
  <SwapSelectionLayout>
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
  </SwapSelectionLayout>
</template>

<script setup lang="ts">
const { accountId } = useAuth()
const { swap } = storeToRefs(useAtomicSwapsStore())

const query = reactive({
  currentOwner_eq: accountId.value,
  burned_eq: false,
})

watchEffect(() => {
  if (swap.value.offered.length > swap.value.desired.length) {
    swap.value.offered = []
  }
})
</script>
