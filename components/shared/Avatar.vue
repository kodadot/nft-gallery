<template>
  <Identicon
    :data-key="value"
    :size="size"
    :theme="theme"
    :value="value"
    data-testid="avatar-identity-icon"
    class="border border-border-color rounded-full" />
</template>

<script lang="ts" setup>
import { isEthereumAddress } from '@polkadot/util-crypto'
import Identicon from '@polkadot/vue-identicon'

const props = withDefaults(
  defineProps<{
    value: string
    size?: number
  }>(),
  {
    value: '',
    size: 64,
  },
)

const theme = computed(() =>
  props.value && isEthereumAddress(props.value) ? 'jdenticon' : 'polkadot',
)
</script>
