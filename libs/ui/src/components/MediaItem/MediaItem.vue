<template>
  <div class="media-object">
    <component
      :is="resolveComponent"
      :src="properSrc"
      :animation-src="animationSrc"
      :alt="title"
      :placeholder="placeholder"
      :original="original"
      :is-n-s-f-w="isNSFW"
      :is-detail="isDetail" />
    <div
      v-if="isNSFW && isNSFWBlurredLayer"
      class="nsfw-blur is-flex is-align-items-center is-justify-content-center is-flex-direction-column">
      <NeoIcon icon="eye-slash" class="mb-3" />
      <span class="heading-nsfw">Explicit/sensitive content</span>
      <span class="nsfw-desc"
        >Mature audiences only. Please confirm your age and consent to
        proceed.</span
      >
      <span class="nsfw-content" @click="showContent()">Show Content</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineAsyncComponent } from 'vue'

import { getMimeType, resolveMedia } from '@/utils/gallery/media'
import NeoIcon from './../NeoIcon/NeoIcon.vue'

const SUFFIX = 'Media'

export default {
  components: {
    NeoIcon,
  },
  props: {
    src: {
      // for mimeType image please use this props
      type: String,
      default: '',
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
    isNSFW: {
      // original size of the image
      type: Boolean,
      default: false,
    },
    isDetail: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '',
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
      isNSFWBlurredLayer: true,
    }
  },
  computed: {
    resolveComponent() {
      const type = this.mimeType || this.defaultMimeType
      return this.components[resolveMedia(type) + SUFFIX]
    },
    properSrc() {
      return this.src || this.placeholder
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
    showContent() {
      this.isNSFWBlurredLayer = false
    },
  },
}
</script>

<style lang="scss">
.nsfw-blur {
  backdrop-filter: blur(60px);
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  color: #fff;
  text-transform: capitalize;

  .heading-nsfw {
    font-weight: 700;
  }
  .nsfw-desc {
    max-width: 18.75rem;
    text-align: center;
  }

  .nsfw-content {
    cursor: pointer;
    bottom: 3.125rem;
    position: absolute;
  }
}
</style>
