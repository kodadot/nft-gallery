<template>
  <div class="media-object" style="height: fit-content">
    <component
      :is="resolveComponent"
      :src="properSrc"
      :animation-src="animationSrc"
      :alt="title"
      :placeholder="placeholder"
      :original="original"
      :is-lewd="isLewd"
      :is-detail="isDetail"
      :player-cover="audioPlayerCover"
      :hover-on-cover-play="audioHoverOnCoverPlay" />
    <div
      v-if="isLewd && isLewdBlurredLayer"
      class="nsfw-blur is-capitalized is-flex is-align-items-center is-justify-content-center is-flex-direction-column">
      <NeoIcon icon="eye-slash" class="mb-3" />
      <span class="has-text-weight-bold">
        {{ $t('lewd.explicit') }}
      </span>
      <span class="nsfw-desc text-align-center">{{
        $t('lewd.explicitDesc')
      }}</span>
    </div>
    <NeoButton
      v-if="isLewd"
      rounded
      no-shadow
      class="nsfw-action no-border px-4 py-1 is-size-6"
      :class="{ hide: isLewdBlurredLayer }"
      :label="
        isLewdBlurredLayer ? $t('lewd.showContent') : $t('lewd.hideContent')
      "
      @click="toggleContent" />
  </div>
</template>

<script lang="ts" setup>
import { getMimeType, resolveMedia } from '@/utils/gallery/media'
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import ImageMedia from './type/ImageMedia.vue'
import VideoMedia from './type/VideoMedia.vue'
import AudioMedia from './type/AudioMedia.vue'
import ModelMedia from './type/ModelMedia.vue'
import JsonMedia from './type/JsonMedia.vue'
import IFrameMedia from './type/IFrameMedia.vue'
import ObjectMedia from './type/ObjectMedia.vue'
import Media from './type/UnknownMedia.vue'

const SUFFIX = 'Media'
const props = withDefaults(
  defineProps<{
    src?: string
    animationSrc?: string
    mimeType?: string
    title?: string
    original?: boolean
    isLewd?: boolean
    isDetail?: boolean
    placeholder?: string
    audioPlayerCover?: string
    audioHoverOnCoverPlay?: boolean
  }>(),
  {
    src: '',
    animationSrc: '',
    mimeType: '',
    title: 'KodaDot NFT',
    original: false,
    isLewd: false,
    isDetail: false,
    placeholder: '',
  },
)
// props.mimeType may be empty string "". Add `image/png` as fallback
const mimeType = ref(!!props.mimeType ? props.mimeType : 'image/png')
const isLewdBlurredLayer = ref(props.isLewd)
const components = {
  ImageMedia,
  VideoMedia,
  AudioMedia,
  ModelMedia,
  JsonMedia,
  IFrameMedia,
  ObjectMedia,
  Media,
}

const resolveComponent = computed(() => {
  return components[resolveMedia(mimeType.value) + SUFFIX]
})
const properSrc = computed(() => props.src || props.placeholder)

const updateComponent = async () => {
  if (props.animationSrc && !props.mimeType) {
    mimeType.value = await getMimeType(props.animationSrc)
  }
}

watch(
  () => props.animationSrc,
  () => updateComponent(),
  {
    immediate: true,
  },
)

const toggleContent = () => {
  isLewdBlurredLayer.value = !isLewdBlurredLayer.value
}

defineExpose({ isLewdBlurredLayer })
</script>

<style lang="scss" scoped>
@import '@/assets/styles/abstracts/variables';
.media-object {
  .nsfw-blur {
    backdrop-filter: blur(60px);
    position: absolute;
    top: 0;
    height: 100%;
    width: 100%;
    @include ktheme() {
      color: theme('text-color');
    }

    .nsfw-desc {
      max-width: 18.75rem;
    }
  }
  .nsfw-action {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 1.25rem;
    @include ktheme() {
      color: theme('text-color') !important;
      background: theme('background-color') !important;
    }
    &.hide {
      @include ktheme() {
        color: theme('background-color') !important;
        background: theme('text-color') !important;
      }
    }
  }
}
</style>
