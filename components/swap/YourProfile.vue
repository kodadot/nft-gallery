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
        v-if="lastSwap"
        :title="$t('swap.yourOffer')"
        :items="lastSwap.offered"
        @clear="lastSwap.offered = []"
      />
    </template>
  </SwapSelectionLayout>
</template>

<script setup lang="ts">
const atomicSwapsStore = useAtomicSwapsStore()
const { toast } = useToast()
const { lastSwap } = storeToRefs(atomicSwapsStore)
const { accountId } = useAuth()

const query = reactive({
  currentOwner_eq: accountId.value,
  burned_eq: false,
})

onBeforeMount(async () => {
  if (!lastSwap.value) {
    toast('First select the NFTs you want to offer')
    await navigateTo({ name: 'prefix-swap-id', params: { id: useRoute().params.id } })
  }
})
</script>
