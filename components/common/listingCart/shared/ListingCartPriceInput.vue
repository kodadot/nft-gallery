<template>
  <div class="flex">
    <div
      class="flex price-input border border-k-shade"
      :class="{ 'price-input__fullwidth': fullWidth }">
      <input
        v-model="model"
        type="text"
        class="price-input height-40 theme-background-color has-text-color"
        :placeholder="$t('offer.price')" />
      <div class="px-5 flex items-center">{{ chainSymbol }}</div>
    </div>
    <NeoButton
      v-if="check"
      no-shadow
      class="shade-border-color ml-2 height-40"
      icon-pack="fas"
      icon="check"
      @click="emit('confirm')" />
  </div>
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'

const props = defineProps<{
  modelValue?: number | string
  check?: boolean
  fullWidth?: boolean
}>()
const emit = defineEmits(['confirm'])
const model = useVModel(props, 'modelValue')
const { chainSymbol } = useChain()

watch(model, (newValue) => {
  const sanitizedValue = Number(
    (newValue?.toString() ?? '').replace(/[^0-9.]/g, ''),
  )
  if (sanitizedValue !== newValue) {
    model.value = sanitizedValue
  }
})
</script>

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.price-input {
  @include ktheme() {
    &:focus-within {
      border-color: theme('border-color') !important;
    }
  }

  input {
    border: none;
    outline: none;
    width: 5em;
    text-indent: 10px;
  }
}

.price-input__fullwidth {
  width: 100%;

  input {
    width: 100%;
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
