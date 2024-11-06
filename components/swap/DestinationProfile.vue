<template>
  <SwapSelectionLayout>
    <template #title>
      <SwapBannerTitle
        step="2/4"
        :title="$t('swap.selectNft')"
        :subtitle="$t('swap.clickOnNft')"
      />
    </template>

    <SwapGridList :query />

    <template #preview>
      <SwapPreview
        v-if="lastSwap"
        :title="$t('swap.yourSwapList')"
        :items="lastSwap.desired"
        :disabled="!lastSwap.desired.length"
        @next="onNext"
        @clear="lastSwap.desired = []"
      />
    </template>
  </SwapSelectionLayout>
</template>

<script setup lang="ts">
const { accountId } = useAuth()
const route = useRoute()

const atomicSwapsStore = useAtomicSwapsStore()
const { lastSwap } = storeToRefs(atomicSwapsStore)

const query = reactive({
  currentOwner_eq: route.params.id,
  currentOwner_not_eq: accountId.value,
  burned_eq: false,
})

const onNext = async () => {
  await navigateTo({ name: 'prefix-swap-id-offer', params: { id: route.params.id } })
}

onBeforeMount(() => {
  if (!lastSwap.value) {
    atomicSwapsStore.createSwap()
  }
})
</script>
