<template>
  <NeoField :label="$t(label)">
    <NeoInput
      v-model="vValue"
      type="number"
      :placeholder="placeholder"
      :expanded="expanded"
      :step="step"
      :min-step="minStep"
      :min="min"
      :max="max"
      @blur="hasFocus = false"
      @focus="hasFocus = true" />
    <template #message>
      <transition name="fade">
        <span v-show="hasFocus && message" class="has-text-primary is-italic">{{
          message
        }}</span>
      </transition>
    </template>
  </NeoField>
</template>

<script lang="ts" setup>
import { NeoField, NeoInput } from '@kodadot1/brick'

const props = withDefaults(
  defineProps<{
    modelValue: number | string
    label: string
    placeholder?: string
    expanded?: boolean
    message?: string
    max?: number
    min?: number
    step?: number
    minStep?: number
  }>(),
  {
    expanded: false,
    min: 1,
    step: 1,
  },
)

const emit = defineEmits(['update:modelValue'])
const vValue = useVModel(props, 'modelValue', emit, { eventName: 'input' })
const hasFocus = ref(false)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
