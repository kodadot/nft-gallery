<template>
  <div ref="wrapper" class="relative w-full h-full aspect-square">
    <iframe
      :id="iframeId"
      ref="iframe"
      :title="title"
      class="absolute flex w-[1080px] h-[1080px] aspect-square origin-top-left"
      :src="iframeSrc"
      :alt="alt"
      :sandbox="sandbox"
      :allow="allow"
      @load="emit('load')" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { useElementSize } from '@vueuse/core'

const IFRAME_BASE_SIZE = 1080

const emit = defineEmits(['load'])
const props = withDefaults(
  defineProps<{
    src?: string
    animationSrc?: string
    alt?: string
    title?: string
    iframeId?: string
    sandbox?: string
    allow?: string
  }>(),
  {
    title: 'html-embed',
    sandbox: 'allow-scripts allow-same-origin allow-modals',
    allow:
      'accelerometer *; camera *; gyroscope *; microphone *; xr-spatial-tracking *;',
  },
)

const wrapper = ref<HTMLDivElement>()
const iframe = ref<HTMLIFrameElement>()
const { width, height } = useElementSize(wrapper)
const { height: windowHeight, width: windowWidth } = useWindowSize()

const iframeSrc = ref('')
const computedSrc = computed(() => props.animationSrc || props.src || '')

const getScale = ({
  width,
  height,
}: {
  width: number
  height: number
}): number => Math.min(width / IFRAME_BASE_SIZE, height / IFRAME_BASE_SIZE)

onMounted(() => {
  iframeSrc.value = computedSrc.value
})

watch(computedSrc, (src) => {
  if (iframe.value?.src !== src) {
    iframe.value?.contentWindow?.location.replace(src)
  }
})

watchEffect(() => {
  if (width.value && height.value) {
    if (!iframe.value) {
      return
    }

    const isFullscreenMode = Boolean(document.fullscreenElement)

    const scale = isFullscreenMode
      ? getScale({ width: windowWidth.value, height: windowHeight.value })
      : getScale({ width: width.value, height: height.value })
    const xSpace = windowWidth.value - IFRAME_BASE_SIZE * scale
    const ySpace = windowHeight.value - IFRAME_BASE_SIZE * scale

    iframe.value.style.transform = `scale(${scale})`
    iframe.value.style.left =
      isFullscreenMode && xSpace > 0 ? `${Math.ceil(xSpace / 2)}px` : ''
    iframe.value.style.top =
      isFullscreenMode && ySpace > 0 ? `${Math.ceil(ySpace / 2)}px` : ''
  }
})
</script>
