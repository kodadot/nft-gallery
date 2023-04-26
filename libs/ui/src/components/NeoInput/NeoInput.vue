<template>
  <o-input
    v-model="inputValue"
    class="neo-input"
    v-bind="$attrs"
    :style="heightStyle"
    @input="updateValue" />
</template>

<script lang="ts" setup>
import { OInput } from '@oruga-ui/oruga'
import { useVModel } from '@vueuse/core'

const props = defineProps<{
  value: string | number
  height?: number | string
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

<style lang="scss" scoped>
@import './NeoInput.scss';
</style>
