<template>
  <TokenMoney
    v-if="tokenId"
    :value="value"
    :token-id="tokenId"
    :prefix="urlPrefix"
    :data-testid="money"
    :round="round"
    inline />
  <Money v-else :value="value" :data-testid="money" inline :round="round" />
</template>

<script lang="ts" setup>
import Money from '@/components/shared/format/Money.vue'
import TokenMoney from '@/components/bsx/format/TokenMoney.vue'
import { getKusamaAssetId } from '@/utils/api/bsx/query'

defineProps({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  value: {
    type: [Number, String, BigInt],
    default: '0',
  },
  dataCy: {
    type: String,
    required: false,
    default: '',
  },
  round: {
    type: Number,
    default: 4,
  },
})

const { urlPrefix } = usePrefix()
const tokenId = computed(() => getKusamaAssetId(urlPrefix.value))
</script>
