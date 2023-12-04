<template>
  <div class="w-full h-full z-10 min-w-0 relative">
    <div class="h-0 w-full pb-[100%]" />
    <model-viewer
      class="inset-0 min-w-0 h-full w-full flex items-center justify-center absolute"
      :style="{
        '--poster-color': 'transparent',
        '--progress-bar-color': 'lightpink',
      }"
      :src="animationSrc"
      auto-rotate
      ar-modes="webxr scene-viewer quick-look"
      shadow-intensity="1"
      autoplay
      camera-controls
      :disable-zoom="disableOperation"
      data-testid="type-3d" />
  </div>
</template>

<script lang="ts" setup>
import '@google/model-viewer'

defineProps<{
  animationSrc: string
  disableOperation?: boolean
}>()
</script>
