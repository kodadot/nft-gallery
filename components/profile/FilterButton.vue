<template>
  <NeoButton
    :variant="variant"
    :active="model"
    :label="label"
    @click="model = !model"
  >
    <slot />
  </NeoButton>
</template>

<script setup lang="ts">
import type { NeoButtonVariant } from '@kodadot1/brick'
import { NeoButton } from '@kodadot1/brick'

const emit = defineEmits(['update:modelValue'])
const route = useRoute()
const { replaceUrl } = useReplaceUrl()

const props = withDefaults(defineProps<{
  modelValue?: boolean
  label?: string
  urlParam: string
  variant?: NeoButtonVariant
}>(), {
  modelValue: undefined,
  variant: undefined,
})

const isModelValue = computed(() => props.modelValue !== undefined)

const model = computed({
  get: () => isModelValue.value ? props.modelValue : route.query[props.urlParam] === 'true',
  set: (val) => {
    if (isModelValue.value) {
      emit('update:modelValue', val)
    }
    else {
      replaceUrl({ [props.urlParam]: val })
    }
  },
})
</script>
