<template>
  <div class="flex">
    <div
      class="flex focus-within:!border-border-color border border-k-shade h-10"
      :class="{ 'price-input__fullwidth': fullWidth }">
      <input
        v-model="model"
        type="number"
        step="0.01"
        min="0.001"
        pattern="[0-9]+([\.,][0-9]+)?"
        class="indent-2.5 border-none outline-none w-20 bg-background-color text-text-color"
        :placeholder="$t('price')" />
      <div class="px-3 flex items-center">{{ chainSymbol }}</div>
    </div>
    <NeoButton
      v-if="check"
      no-shadow
      class="border-k-shade hover:!border-border-color ml-2 h-10"
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
const emit = defineEmits(['confirm', 'update:modelValue'])

const model = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value === '' ? undefined : value)
  },
})

const { chainSymbol } = useChain()
</script>

<style scoped lang="scss">
.price-input__fullwidth {
  width: 100%;

  input {
    width: 100%;
  }
}
</style>
