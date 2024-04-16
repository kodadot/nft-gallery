<template>
  <div
    class="h-full min-w-0 relative"
    :class="{ 'w-[95%]': isFullscreen, 'w-full': !isFullscreen }">
    <div
      class="h-0 w-full"
      :class="{ 'pb-[65%]': isFullscreen, 'pb-[100%]': !isFullscreen }" />
    <video
      ref="video"
      class="absolute inset-0 min-w-0 w-full h-full flex items-center justify-center"
      :class="{ 'ml-7 pt-6': isFullscreen }"
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
import { useEventListener } from '@vueuse/core'

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

const video = ref()
const imgref = ref<HTMLElement | null>(null)
const { isFullscreen } = useFullscreen(imgref)

const autoPlay = computed(() =>
  props.autoplay === undefined ? props.preview : props.autoplay,
)
const controls = computed(() => !props.preview)

if (!autoPlay.value && props.src) {
  useEventListener(video, 'loadeddata', () => {
    video.value.play()
    video.value.pause()
  })
}
</script>
