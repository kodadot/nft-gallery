<script lang="ts" setup>
import { defineProps } from '#app'

const { src, mimeType } = defineProps<{
  src?: string
  mimeType?: string
}>()
</script>

<template>
  <iframe
    title="html-embed"
    class="iframe-model__wrapper"
    :src="src"
    :alt="mimeType"
    sandbox="allow-scripts allow-same-origin"
    allow="accelerometer; camera; gyroscope; microphone; xr-spatial-tracking;" />
</template>

<style scoped>
.iframe-model__wrapper {
  height: 100%;
  min-height: 37em;
  width: 100%;
}
</style>
