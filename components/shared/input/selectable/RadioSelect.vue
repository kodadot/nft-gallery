<template>
  <component
    :is="separated || multiline ? 'div' : 'b-field'"
    v-if="options"
    :class="{ 'columns is-multiline': separated || multiline }">
    <NeoRadioButton
      v-if="showEmpty"
      :value="value"
      native-value=""
      :class="{ 'column is-half': separated, column: multiline }"
      rounded
      @input="handleInput">
      <span><b>NONE</b></span>
    </NeoRadioButton>
    <NeoRadioButton
      v-for="option in options"
      :key="option"
      :value="value"
      :native-value="option"
      :class="{ 'column is-half': separated, column: multiline }"
      rounded
      @input="handleInput">
      <span>{{ option }}</span>
    </NeoRadioButton>
  </component>
</template>

<script setup lang="ts">
import { NeoRadioButton } from '@kodadot1/brick'

const emit = defineEmits(['input'])

defineProps<{
  value: string
  options: string[]
  showEmpty?: boolean
  separated?: boolean
  multiline?: boolean
}>()

const handleInput = (value: string) => {
  emit('input', value)
}
</script>
