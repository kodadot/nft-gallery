<template>
  <SwapSelectionLayout v-if="swap">
    <template #title>
      <SwapBannerTitle
        step="2/4"
        :title="$t('swap.selectNft')"
        :subtitle="$t('swap.clickOnNft')"
      />
    </template>

    <SwapGridList
      :query
      selectable
    />

    <template #preview>
      <SwapPreview
        :title="$t('swap.yourSwapList')"
        :items="swap?.desired || []"
        :disabled="!swap?.desired.length || !accountId"
        :surcharge-title="$t('swap.requestToken')"
        :surcharge-amount="swap.surcharge?.amount"
        @update:surcharge-amount="onSurchargeUpdate"
        @next="onNext"
        @clear="() => {
          if (swap) {
            swap.desired = []
          }
        }"
      />
    </template>
  </SwapSelectionLayout>
</template>

<script setup lang="ts">
const { accountId } = useAuth()
const route = useRoute()

const atomicSwapsStore = useAtomicSwapsStore()
const { swap } = storeToRefs(atomicSwapsStore)

const query = reactive({
  currentOwner_eq: route.params.id,
  currentOwner_not_eq: accountId.value,
  burned_eq: false,
})

const onNext = async () => {
  await navigateTo({ name: 'prefix-swap-id-offer', params: { id: route.params.id } })
}

const onSurchargeUpdate = (amount: string) => {
  if (swap.value) {
    swap.value.surcharge = amount ? { amount, direction: 'Receive' } : undefined
  }
}
</script>
