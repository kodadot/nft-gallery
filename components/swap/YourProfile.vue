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
      selectable
    />

    <template #preview>
      <SwapPreview
        v-if="lastSwap"
        :title="$t('swap.yourOffer')"
        :items="lastSwap.offered"
        @clear="lastSwap.offered = []"
        @next="onNext"
      />
    </template>
  </SwapSelectionLayout>
</template>

<script setup lang="ts">
const atomicSwapsStore = useAtomicSwapsStore()
const { lastSwap } = storeToRefs(atomicSwapsStore)
const { accountId } = useAuth()

const query = reactive({
  currentOwner_eq: accountId.value,
  burned_eq: false,
})
const route = useRoute()

const onNext = async () => {
  await navigateTo({ name: 'prefix-swap-id-review', params: { id: route.params.id } })
}
</script>
