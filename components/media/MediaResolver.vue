<template>
  <component
    :is="resolveComponent"
    v-if="src"
    :src="src"
    :poster="poster || placeholder"
    :description="description"
    :preview="preview"
    :available-animations="availableAnimations" />
</template>

<script lang="ts" setup>
import { resolveMedia } from '@/utils/gallery/media'

const props = defineProps<{
  src?: string
  mimeType?: string
  poster?: string
  description?: string
  availableAnimations?: string[]
  preview?: boolean
}>()

const SUFFIX = 'Media'
const components = {
  VideoMedia: defineAsyncComponent(() => import('./type/VideoMedia.vue')),
  ImageMedia: defineAsyncComponent(() => import('./type/ImageMedia.vue')),
  AudioMedia: defineAsyncComponent(() => import('./type/AudioMedia.vue')),
  JsonMedia: defineAsyncComponent(() => import('./type/JsonMedia.vue')),
  ModelMedia: defineAsyncComponent(() => import('./type/ModelMedia.vue')),
  IFrameMedia: defineAsyncComponent(() => import('./type/IFrameMedia.vue')),
  ObjectMedia: defineAsyncComponent(() => import('./type/ObjectMedia.vue')),
  Media: defineAsyncComponent(() => import('./type/UnknownMedia.vue')),
}

const { isDarkMode } = useTheme()

const resolveComponent = computed(() => {
  return components[resolveMedia(props.mimeType) + SUFFIX]
})

const placeholder = computed(() => {
  return isDarkMode.value ? '/placeholder.webp' : '/placeholder-white.webp'
})
</script>
