<template>
  <div class="media-object">
    <component
      :is="resolveComponent()"
      :src="src"
      :animation-src="animationSrc"
      :alt="title"
      :original="original" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

import { resolveMedia } from '@/utils/gallery/media'
import placeholder from '@/static/placeholder.webp'

const props = defineProps({
  src: {
    // for mimeType image please use this props
    type: String,
    default: placeholder,
  },
  animationSrc: {
    // other than image please use this props instead
    type: String,
    default: '',
  },
  mimeType: {
    type: String,
    default: 'image',
  },
  title: {
    type: String,
    default: 'KodaDot NFT',
  },
  original: {
    // original size of the image
    type: Boolean,
    default: false,
  },
})

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

const resolveComponent = () => {
  // TODO: fetch mime type
  // if (props.animationSrc && !props.mimeType) {}

  return components[resolveMedia(props.mimeType) + SUFFIX]
}
</script>

<style scoped>
.media-object {
  box-shadow: 4px 4px 0 0 rgba(0, 0, 0, 1);
  border: 1px solid black;
}
</style>
