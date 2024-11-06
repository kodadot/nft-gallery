<template>
  <SwapSelectionLayout>
    <template #title>
      <SwapBannerTitle
        step="3/4"
        :title="$t('swap.selectOffer')"
        :subtitle="$t('swap.selectOfferSubtitle')"
      />
    </template>

    <SwapGridList :query />

    <template #preview>
      <SwapPreview
        :title="$t('swap.yourSwapList')"
      />
    </template>
  </SwapSelectionLayout>
</template>

<script setup lang="ts">
const { accountId } = useAuth()

const query = reactive({
  currentOwner_eq: accountId.value,
  burned_eq: false,
})
</script>
