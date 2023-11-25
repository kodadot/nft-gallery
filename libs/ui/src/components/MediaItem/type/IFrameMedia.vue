<template>
  <iframe
    title="html-embed"
    class="w-full h-full aspect-square flex"
    :src="animationSrc || src"
    :alt="alt"
    sandbox="allow-scripts allow-same-origin allow-modals"
    allow="accelerometer *; camera *; gyroscope *; microphone *; xr-spatial-tracking *;" />
</template>

<script lang="ts" setup>
defineProps<{
  src?: string
  animationSrc?: string
  alt?: string
}>()
</script>
