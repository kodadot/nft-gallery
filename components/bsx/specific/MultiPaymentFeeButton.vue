<template>
  <nuxt-link :to="url">
    {{ $t('general.tx.feesPaidIn', [unit]) }}
  </nuxt-link>
</template>

<script setup lang="ts">
import { getAssetIdByAccount } from '@/utils/api/bsx/query'
import shouldUpdate from '@/utils/shouldUpdate'
const { $consola } = useNuxtApp()

const props = withDefaults(
  defineProps<{
    accountId: string
    prefix?: string
  }>(),
  { prefix: 'bsx' },
)
const tokenId = ref('0')
const { assets } = usePrefix()

const asset = computed(() => assets(tokenId.value))

const unit = computed(() => asset.value.symbol)
const url = computed(() => `/${props.prefix}/assets`)

const fetchCurrency = async () => {
  try {
    const { apiInstance } = useApi()
    const api = await apiInstance.value
    tokenId.value = await getAssetIdByAccount(api, props.accountId)
  } catch (e) {
    $consola.warn(e)
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
  },
)
</script>
