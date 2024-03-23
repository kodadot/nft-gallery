<template>
  <div ref="wrapper" class="relative w-full h-full aspect-square">
    <iframe
      ref="iframe"
      title="html-embed"
      class="absolute flex w-[1080px] h-[1080px] aspect-square origin-top-left"
      :src="iframeSrc"
      :alt="alt"
      sandbox="allow-scripts allow-same-origin allow-modals"
      allow="accelerometer *; camera *; gyroscope *; microphone *; xr-spatial-tracking *;" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { useElementSize } from '@vueuse/core'

const props = defineProps<{
  src?: string
  animationSrc?: string
  alt?: string
}>()

const wrapper = ref<HTMLDivElement>()
const iframe = ref<HTMLIFrameElement>()
const { width, height } = useElementSize(wrapper)

const computedSrc = computed(() => props.animationSrc || props.src || '')

const iframeSrc = ref('')

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

    const scale = Math.min(width.value / 1080, height.value / 1080)

    iframe.value.style.transform = `scale(${scale})`
  }
})
</script>
