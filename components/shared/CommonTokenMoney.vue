<template>
  <TokenMoney
    v-if="tokenId"
    :value="value"
    :token-id="tokenId"
    :prefix="urlPrefix"
    :data-cy="dataCy"
    :round="round"
    inline />
  <Money v-else :value="value" :data-cy="dataCy" inline :round="round" />
</template>

<script lang="ts" setup>
import Money from '@/components/shared/format/Money.vue'
import TokenMoney from '@/components/bsx/format/TokenMoney.vue'
import { getKusamaAssetId } from '@/utils/api/bsx/query'

withDefaults(
  defineProps<{
    value: number | string | undefined
    customTokenId?: string | undefined
    dataCy: string
    round: number
  }>(),
  {
    value: '0',
    customTokenId: '',
    dataCy: '',
    round: 4,
  }
)

const { urlPrefix } = usePrefix()
const tokenId = computed(() => getKusamaAssetId(urlPrefix.value))
</script>
