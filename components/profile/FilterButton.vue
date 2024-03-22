<template>
  <NeoButton
    :variant="variant"
    :active="model"
    no-shadow
    rounded
    :label="label"
    @click="model = !model" />
</template>

<script setup lang="ts">
import { NeoButton, NeoButtonVariant } from '@kodadot1/brick'

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

<style scoped lang="scss">
@import '@/assets/styles/abstracts/variables';

.active {
  @include ktheme() {
    border-color: theme('background-color-inverse') !important;
  }
  &:hover {
    @include ktheme() {
      background-color: theme('background-color-inverse') !important;
      color: theme('text-color-inverse') !important;
    }
  }
}
</style>
