<template>
  <div
    v-if="isEVMAddress"
    v-dompurify-html:svg="evmAvatarSvg"
    :class="WRAPPER_CLASS"
    :style="{
      width: `${size}px`,
      height: `${size}px`,
    }" />
  <Identicon
    v-else
    :data-key="value"
    :size="size"
    theme="polkadot"
    :value="value"
    data-testid="avatar-identity-icon"
    :class="WRAPPER_CLASS" />
</template>

<script lang="ts" setup>
import { isEthereumAddress } from '@polkadot/util-crypto'
import Identicon from '@polkadot/vue-identicon'
import { toSvg } from 'jdenticon'

const WRAPPER_CLASS = 'border border-border-color rounded-full overflow-hidden'

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

const evmAvatarSvg = computed(() =>
  toSvg(props.value, props.size - 2, {
    padding: 0.1,
  }),
)

const isEVMAddress = computed(
  () => props.value && isEthereumAddress(props.value),
)
</script>
