<template>
  <nuxt-link :to="url">
    {{ $t('general.tx.feesPaidIn', [unit]) }}
  </nuxt-link>
</template>

<script setup lang="ts">
import { getAssetIdByAccount } from '@/utils/api/bsx/query'

import shouldUpdate from '@/utils/shouldUpdate'

const props = withDefaults(
  defineProps<{
    accountId: string
    prefix?: string
  }>(),
  { prefix: 'bsx' }
)
const tokenId = ref('0')
const asset = computed(() => useAsset().assetIdOf(tokenId.value))

const unit = computed(() => asset.value.symbol)
const url = computed(() => `/${props.prefix}/assets`)

const fetchCurrency = async () => {
  try {
    const { apiInstance } = useApi()
    const api = await apiInstance.value
    tokenId.value = await getAssetIdByAccount(api, props.accountId)
  } catch (e) {
    console.log(e) // Use `console.log` instead of `this.$consola.log`
  }
}

watch(
  () => props.accountId,
  (val, oldVal) => {
    if (shouldUpdate(val, oldVal)) {
      fetchCurrency()
    }
  },
  {
    immediate: true,
  }
)
</script>
