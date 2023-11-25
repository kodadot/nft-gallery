<template>
  <div class="w-full h-full z-10 min-w-0 relative">
    <div class="h-0 w-full pb-[100%]" />
    <video
      class="absolute inset-0 min-w-0 w-full h-full flex items-center justify-center"
      :controls="controls"
      playsinline
      loop
      :autoplay="autoPlay"
      :muted="preview"
      :poster="src"
      :src="animationSrc || src"
      controlslist="nodownload"
      data-testid="type-video"
      :title="alt" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    animationSrc?: string
    src?: string
    alt?: string
    preview?: boolean
    autoplay?: boolean
  }>(),
  {
    animationSrc: '',
    src: '',
    alt: '',
    preview: false,
    autoplay: undefined,
  },
)

const autoPlay = computed(() =>
  props.autoplay === undefined ? props.preview : props.autoplay,
)
const controls = computed(() => !props.preview)
</script>
