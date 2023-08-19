<template>
  <NeoField>
    <NeoSwitch
      v-model="isSwitched"
      :rounded="false"
      :size="size"
      :disabled="disabled"
      :class="labelColor"
      :type="type"
      data-cy="buy-now">
      <component :is="componentName" :label="message">
        {{ properLabel }}
      </component>
    </NeoSwitch>
  </NeoField>
</template>

<script lang="ts" setup>
import { TranslateResult } from 'vue-i18n'
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
const emit = defineEmits(['update:value'])

const isSwitched = computed({
  get: () => props.value,
  set: (value: boolean) => {
    emit('update:value', value)
  },
})

const componentName = computed(() => {
  return props.message ? 'NeoTooltip' : 'span'
})

const properLabel: TranslateResult = computed(() => {
  const offLabel = props.offLabel || props.label
  return $i18n.t(props.value ? props.label : offLabel)
})
</script>
