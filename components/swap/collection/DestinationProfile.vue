<template>
  <SwapLayoutSelection>
    <template #title>
      <SwapBannerTitle
        step="2/4"
        :title="$t('swap.collectionSwapPreview')"
        :subtitle="$t('swap.collectionSwapDescription')"
      />
    </template>

    <SwapGridList
      :query="query"
    />

    <template #preview>
      <SwapPreview :step="SwapStep.DESIRED" />
    </template>
  </SwapLayoutSelection>
</template>

<script setup lang="ts">
import { SwapStep } from '@/components/swap/types'

const { accountId } = useAuth()
const route = useRoute()
const collectionId = computed(() => route.params.id.toString())

const query = reactive({
  collection: {
    id_eq: collectionId.value,
  },
  currentOwner_not_eq: accountId.value,
  burned_eq: false,
})
</script>
