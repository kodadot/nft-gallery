<template>
  <iframe
    title="html-embed"
    class="iframe-model__wrapper is-flex"
    :src="src"
    :alt="alt"
    sandbox="allow-scripts allow-same-origin allow-modals"
    allow="accelerometer *; camera *; gyroscope *; microphone *; xr-spatial-tracking *;" />
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
  aspect-ratio: 1;
  width: 100%;
}
</style>
