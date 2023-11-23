<template>
  <TokenMoney
    v-if="tokenId"
    :value="value"
    :data-testid="dataCy"
    :round="round"
    inline />
  <Money v-else :value="value" :data-testid="dataCy" inline :round="round" />
</template>

<script lang="ts" setup>
import Money from '@/components/shared/format/Money.vue'
import TokenMoney from '@/components/bsx/format/TokenMoney.vue'

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
    default: 2,
  },
})

const { tokenId } = usePrefix()
</script>
