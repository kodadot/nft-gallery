<template>
  <o-tabs v-model="model">
    <slot name="items" />
  </o-tabs>
</template>

<script setup lang="ts">
import { OTabs } from '@oruga-ui/oruga'
import { useVModel } from '@vueuse/core'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
})
const emit = defineEmits(['update:modelValue'])
const model = useVModel(props, 'modelValue', emit)
</script>

<style lang="scss">
@import './NeoTab.scss';
</style>
