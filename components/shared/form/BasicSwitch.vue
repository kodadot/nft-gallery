<template>
  <NeoField>
    <NeoSwitch
      v-model="isSwitched"
      :rounded="false"
      :size="size"
      :disabled="disabled"
      :class="labelColor"
      :type="type"
      data-testid="buy-now">
      <component :is="componentName" :label="message">
        {{ properLabel }}
      </component>
    </NeoSwitch>
  </NeoField>
</template>

<script lang="ts" setup>
import { NeoField, NeoSwitch, NeoTooltip } from '@kodadot1/brick'

const props = defineProps<{
  modelValue: boolean
  label: string
  offLabel?: string
  size?: string
  type?: string
  labelColor?: string
  message?: string
  disabled?: boolean
}>()

const { $i18n } = useNuxtApp()
const emit = defineEmits(['update:modelValue'])

const isSwitched = useVModel(props, 'modelValue', emit, {
  eventName: 'update:modelValue',
})

const componentName = computed(() => {
  return props.message ? NeoTooltip : 'span'
})

const properLabel = computed(() => {
  const offLabel = props.offLabel || props.label
  return $i18n.t(props.modelValue ? props.label : offLabel)
})
</script>
