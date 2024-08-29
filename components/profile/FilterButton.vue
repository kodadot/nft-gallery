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

const route = useRoute()
const { replaceUrl } = useReplaceUrl()

const props = defineProps<{
  label?: string
  urlParam: string
  variant?: NeoButtonVariant
}>()

const model = computed({
  get: () => route.query[props.urlParam] === 'true',
  set: (val) => {
    replaceUrl({ [props.urlParam]: val })
  },
})
</script>
