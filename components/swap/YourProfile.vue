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
      :selectable="swap?.desired.length !== swap?.offered.length"
    />

    <template #preview>
      <SwapPreview
        v-if="swap"
        :title="$t('swap.yourOffer')"
        :disabled="!swap.offered.length"
        :items="swap.offered"
        :surcharge-title="$t('swap.addToken')"
        :surcharge-amount="swap.surcharge?.amount"
        @update:surcharge-amount="onSurchargeUpdate"
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

const onSurchargeUpdate = (amount: string) => {
  if (swap.value) {
    swap.value.surcharge = amount ? { amount, direction: 'Send' } : undefined
  }
}
</script>
