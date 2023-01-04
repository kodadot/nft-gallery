<template>
  <o-tabs v-model="tabValue">
    <slot name="items" />
  </o-tabs>
</template>

<script setup lang="ts">
import { OTabs } from '@oruga-ui/oruga'

const props = defineProps({
  modelValue: String,
})
const emit = defineEmits(['update:modelValue'])
const tabValue = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    console.log('helllo4')
    emit('update:modelValue', val)
  },
})
</script>

<style lang="scss">
@import './NeoTab.scss';
</style>
