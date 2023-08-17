<template>
  <NeoButton
    :active="model"
    no-shadow
    rounded
    :label="label"
    @click.native="model = !model" />
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'

const route = useRoute()
const { replaceUrl } = useReplaceUrl()

const props = defineProps<{
  label: string
  urlParam?: string
}>()

const urlParamName = computed(() => props.urlParam || props.label)

const model = computed({
  get: () => route.query[urlParamName.value] === 'true',
  set: (val) => {
    replaceUrl({ [urlParamName.value]: val })
  },
})
</script>
