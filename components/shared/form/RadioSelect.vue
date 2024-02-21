<template>
  <component
    :is="separated || multiline ? 'div' : 'NeoField'"
    v-if="options"
    :class="{ 'flex flex-wrap mb-3': separated || multiline }">
    <NeoRadioButton
      v-if="showEmpty"
      v-model="vValue"
      native-value=""
      :class="cssClass"
      :rounded="rounded">
      <span><b>NONE 🚫</b></span>
    </NeoRadioButton>
    <NeoRadioButton
      v-for="option in options"
      :key="option"
      v-model="vValue"
      :native-value="option"
      :class="cssClass"
      :rounded="rounded">
      <span>{{ option }}</span>
    </NeoRadioButton>
  </component>
</template>

<script setup lang="ts">
import { NeoRadioButton } from '@kodadot1/brick'

const props = defineProps<{
  modelValue: string
  options: string[]
  showEmpty?: boolean
  separated?: boolean
  multiline?: boolean
  rounded?: boolean
}>()

const emit = defineEmits(['update:modelValue'])
const vValue = useVModel(props, 'modelValue', emit)

const cssClass = {
  'w-1/2 p-3': props.separated,
  'flex-1 p-3': props.multiline,
}
</script>
