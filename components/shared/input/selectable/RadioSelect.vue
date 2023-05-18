<template>
  <component
    :is="separated ? 'div' : 'NeoField'"
    v-if="options"
    :class="{ 'columns is-multiline': separated }">
    <NeoRadioButton
      v-if="showEmpty"
      :value="value"
      native-value=""
      type="is-primary"
      class="collection-radio-btn"
      :class="{ 'column is-half': separated }"
      @input="handleInput">
      <span><b>NONE</b></span>
    </NeoRadioButton>
    <NeoRadioButton
      v-for="option in options"
      :key="option"
      :value="value"
      :native-value="option"
      type="is-primary"
      class="collection-radio-btn"
      :class="{ 'column is-half': separated }"
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
}>()

const handleInput = (value: string) => {
  emit('input', value)
}
</script>
