<template>
  <div ref="wrapper" class="iframe-wrapper">
    <iframe
      ref="iframe"
      title="html-embed"
      class="iframe-model__wrapper is-flex"
      :src="animationSrc || src"
      :alt="alt"
      sandbox="allow-scripts allow-same-origin allow-modals"
      allow="accelerometer *; camera *; gyroscope *; microphone *; xr-spatial-tracking *;" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { useElementSize } from '@vueuse/core'

const wrapper = ref<HTMLDivElement>()
const iframe = ref<HTMLIFrameElement>()
const { width, height } = useElementSize(wrapper)

watchEffect(() => {
  if (width.value && height.value) {
    if (!iframe.value) {
      return
    }

    const scale = Math.min(width.value / 1000, height.value / 1000)

    iframe.value.style.transform = `scale(${scale})`
  }
})

defineProps<{
  src?: string
  animationSrc?: string
  alt?: string
}>()
</script>

<style scoped>
.iframe-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  aspect-ratio: 1;
}
.iframe-model__wrapper {
  height: 1000px;
  aspect-ratio: 1;
  width: 1000px;
  position: absolute;
  transform-origin: top left;
}
</style>
