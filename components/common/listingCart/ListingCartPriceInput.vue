<template>
  <div class="is-flex">
    <div class="is-flex price-input">
      <input
        v-model="model"
        type="text"
        class="price-input height-40 theme-background-color has-text-color"
        placeholder="Price" />
      <div class="px-5 is-flex is-align-items-center">{{ chainSymbol }}</div>
    </div>
    <NeoButton
      v-if="check"
      no-shadow
      class="check-btn ml-2 shade-border-color height-40"
      icon="check"
      @click.native="emit('confirm')" />
  </div>
</template>
<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import { useVModel } from '@vueuse/core'
const props = defineProps<{ value?: number | string; check?: boolean }>()
const emit = defineEmits(['confirm', 'input'])
const model = useVModel(props, 'value', emit, { eventName: 'input' })
const { chainSymbol } = useChain()
</script>

<style scoped lang="scss">
@import '@/styles/abstracts/variables';

.price-input {
  border: 1px solid;
  @include ktheme() {
    border-color: theme('k-shade');
    &:focus-within {
      border-color: theme('border-color');
    }
  }

  input {
    border: none;
    outline: none;
    width: 5em;
    text-indent: 10px;
  }
}

.height-40 {
  height: 40px;
}

.shade-border-color {
  @include ktheme() {
    border-color: theme('k-shade');
    &:hover {
      border-color: theme('border-color');
    }
  }
}
</style>
