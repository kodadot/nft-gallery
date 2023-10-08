<template>
  <Identicon :size="size" theme="polkadot" :value="value" class="avatar" />
</template>

<script lang="ts" setup>
import Identicon from '@polkadot/vue-identicon'

withDefaults(
  defineProps<{
    value: string
    size?: number
  }>(),
  {
    value: '',
    size: 64,
  },
)
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';

.avatar {
  @include ktheme() {
    border: 1px solid theme('border-color');
  }
  border-radius: 50%;
}
</style>
