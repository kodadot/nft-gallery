<template>
  <o-input
    v-model="inputValue"
    :placeholder="placeholder"
    class="neo-input"
    v-bind="$attrs"
    :style="heightStyle"
    @input="updateValue" />
</template>

<script lang="ts" setup>
import { OInput } from '@oruga-ui/oruga'

const props = defineProps<{
  value: string | number
  height?: number | string
  placeholder?: string
}>()
const emit = defineEmits(['input'])

const inputValue = useVModel(props, 'value')
const updateValue = (event) => {
  emit('input', event)
}

const heightStyle = computed(() => {
  if (props.height) {
    return {
      '--neo-input-height':
        typeof props.height === 'number' ? `${props.height}px` : props.height,
    }
  }
  return {}
})
</script>

<style lang="scss">
@import './NeoInput.scss';
</style>
