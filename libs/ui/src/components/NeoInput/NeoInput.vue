<template>
  <o-input
    v-model="model"
    class="neo-input"
    v-bind="$attrs"
    :style="heightStyle" />
</template>

<script lang="ts" setup>
import { OInput } from '@oruga-ui/oruga'
import { useVModel } from '@vueuse/core'

const props = defineProps<{
  modelValue: string
  height?: number | string
}>()
const emit = defineEmits(['update:modelValue'])

const heightStyle = computed(() => {
  if (props.height) {
    return {
      '--neo-input-height':
        typeof props.height === 'number' ? `${props.height}px` : props.height,
    }
  }
  return {}
})

const model = useVModel(props, 'modelValue', emit)
</script>

<style lang="scss" scoped>
@import './NeoInput.scss';
</style>
