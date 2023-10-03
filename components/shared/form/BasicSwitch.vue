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
import type { TranslateResult } from 'vue-i18n/types'
import { NeoField, NeoSwitch, NeoTooltip } from '@kodadot1/brick'

const props = defineProps<{
  value: boolean
  label: string
  offLabel?: string
  size?: string
  type?: string
  labelColor?: string
  message?: string
  disabled?: boolean
}>()

const { $i18n } = useNuxtApp()
const emit = defineEmits(['input'])

const isSwitched = useVModel(props, 'value', emit, { eventName: 'input' })

const componentName = computed(() => {
  return props.message ? NeoTooltip : 'span'
})

const properLabel = computed<TranslateResult>(() => {
  const offLabel = props.offLabel || props.label
  return $i18n.t(props.value ? props.label : offLabel)
})
</script>
