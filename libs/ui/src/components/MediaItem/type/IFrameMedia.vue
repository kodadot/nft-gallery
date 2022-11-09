<template>
  <iframe
    title="html-embed"
    class="iframe-model__wrapper"
    :src="src"
    :alt="alt"
    sandbox="allow-scripts allow-same-origin"
    allow="accelerometer; camera; gyroscope; microphone; xr-spatial-tracking;" />
</template>

<script lang="ts" setup>
defineProps<{
  src?: string
  alt?: string
}>()
</script>

<style scoped>
.iframe-model__wrapper {
  height: 100%;
  min-height: 37em;
  width: 100%;
}
</style>
