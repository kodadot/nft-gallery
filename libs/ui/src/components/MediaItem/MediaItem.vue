<template>
  <div class="media-object">
    <component
      :is="resolveComponent"
      :src="properSrc"
      :animation-src="animationSrc"
      :alt="title"
      :original="original"
      :is-detail="isDetail" />
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from 'vue'

import { getMimeType, resolveMedia } from '@/utils/gallery/media'
import placeholder from '@/static/placeholder.webp'

const SUFFIX = 'Media'

export default {
  props: {
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
      default: '',
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
    isDetail: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      defaultMimeType: 'image',
      components: {
        ImageMedia: defineAsyncComponent(() => import('./type/ImageMedia.vue')),
        VideoMedia: defineAsyncComponent(() => import('./type/VideoMedia.vue')),
        AudioMedia: defineAsyncComponent(() => import('./type/AudioMedia.vue')),
        ModelMedia: defineAsyncComponent(() => import('./type/ModelMedia.vue')),
        JsonMedia: defineAsyncComponent(() => import('./type/JsonMedia.vue')),
        IFrameMedia: defineAsyncComponent(
          () => import('./type/IFrameMedia.vue')
        ),
        ObjectMedia: defineAsyncComponent(
          () => import('./type/ObjectMedia.vue')
        ),
        Media: defineAsyncComponent(() => import('./type/UnknownMedia.vue')),
      },
    }
  },
  computed: {
    resolveComponent() {
      const type = this.mimeType || this.defaultMimeType
      return this.components[resolveMedia(type) + SUFFIX]
    },
    properSrc() {
      return this.src || placeholder
    },
  },
  watch: {
    animationSrc() {
      this.updateComponent()
    },
  },
  mounted() {
    this.updateComponent()
  },
  methods: {
    async updateComponent() {
      if (this.animationSrc && !this.mimeType) {
        this.defaultMimeType = await getMimeType(this.animationSrc)
      }
    },
  },
}
</script>

<style scoped>
.media-object {
  box-shadow: 4px 4px 0 0 rgba(0, 0, 0, 1);
  border: 1px solid black;
}
</style>
