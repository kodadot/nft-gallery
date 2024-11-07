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
        v-if="swap"
        :title="$t('swap.yourOffer')"
        :disabled="!swap.offered.length"
        :items="swap.offered"
        @clear="swap.offered = []"
        @next="onNext"
      />
    </template>
  </SwapSelectionLayout>
</template>

<script setup lang="ts">
const atomicSwapsStore = useAtomicSwapsStore()
const { swap } = storeToRefs(atomicSwapsStore)
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
