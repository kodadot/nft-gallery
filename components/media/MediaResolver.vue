<script lang="ts" setup>
import { computed, defineAsyncComponent, defineProps } from '#app'
import { resolveMedia } from '@/utils/gallery/media'

const props = defineProps<{
  src: string
  mimeType: string
  poster?: string
  description?: string
  availableAnimations?: string[]
  preview: boolean
}>()
const SUFFIX = 'Media'

const components = {
  VideoMedia: defineAsyncComponent(() => import('./VideoMedia.vue')),
  ImageMedia: defineAsyncComponent(() => import('./ImageMedia.vue')),
}

const resolveComponent = computed(() => {
  return components[resolveMedia(props.mimeType) + SUFFIX]
})
</script>

<template>
  <component
    :is="resolveComponent"
    v-if="src"
    :src="src"
    :poster="poster || '/placeholder.webp'"
    :description="description"
    :preview="preview"
    :availableAnimations="availableAnimations" />
</template>
