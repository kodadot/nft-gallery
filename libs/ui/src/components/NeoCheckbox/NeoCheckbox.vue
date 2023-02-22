<template>
  <o-checkbox class="neo-checkbox" :disabled="disabled" @input="updateValue">
    <slot />
  </o-checkbox>
</template>

<script lang="ts" setup>
import { OCheckbox } from '@oruga-ui/oruga'
defineProps<{
  disabled?: boolean
}>()
const emit = defineEmits(['input'])

const updateValue = (event) => {
  emit('input', event)
}
</script>

<style lang="scss">
@import './NeoCheckbox.scss';
</style>
