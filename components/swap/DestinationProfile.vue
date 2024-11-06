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
        :title="$t('swap.yourSwapList')"
        :items="desired"
        @next="onNext"
        @clear="desired = []"
      />
    </template>
  </SwapSelectionLayout>
</template>

<script setup lang="ts">
const { accountId } = useAuth()
const route = useRoute()

const { desired } = storeToRefs(useAtomicSwapsStore())

const query = reactive({
  currentOwner_eq: route.params.id,
  currentOwner_not_eq: accountId.value,
  burned_eq: false,
})

const onNext = async () => {
  await navigateTo({ name: 'prefix-swap-id-offer', params: { id: route.params.id } })
}
</script>
