<template>
  <div class="media-object">
    <component
      :is="resolveComponent"
      :src="defaultSrc"
      :animation-src="animationSrc"
      :alt="defaultTitle" />
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'

import { resolveMedia } from '@/utils/gallery/media'
import placeholder from '@/static/placeholder.webp'

const props = defineProps<{
  src?: string // for mimeType image please use this props
  animationSrc?: string // other than image please use this props instead
  mimeType?: string
  title?: string
}>()

const defaultTitle = computed(() => props.title || 'KodaDot')
const defaultSrc = computed(() => {
  return props.src || placeholder
})
const defaultMimeType = computed(() => props.mimeType || 'image')

const SUFFIX = 'Media'
const components = {
  ImageMedia: defineAsyncComponent(() => import('./type/ImageMedia.vue')),
  VideoMedia: defineAsyncComponent(() => import('./type/VideoMedia.vue')),
  AudioMedia: defineAsyncComponent(() => import('./type/AudioMedia.vue')),
  ModelMedia: defineAsyncComponent(() => import('./type/ModelMedia.vue')),
  //   JsonMedia: defineAsyncComponent(() => import('./type/JsonMedia.vue')),
  //   IFrameMedia: defineAsyncComponent(() => import('./type/IFrameMedia.vue')),
  //   ObjectMedia: defineAsyncComponent(() => import('./type/ObjectMedia.vue')),
  //   Media: defineAsyncComponent(() => import('./type/UnknownMedia.vue')),
}

const resolveComponent = computed(() => {
  // TODO: fetch mime type
  // if (props.animationSrc && !props.mimeType) {}

  return components[resolveMedia(defaultMimeType.value) + SUFFIX]
})
</script>

<style scoped>
.media-object {
  box-shadow: 4px 4px 0 0 rgba(0, 0, 0, 1);
  border: 1px solid black;
}
</style>
