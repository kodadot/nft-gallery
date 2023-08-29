<template>
  <div class="media-object" style="height: 100%">
    <component
      :is="resolveComponent"
      :src="properSrc"
      :animation-src="animationSrc"
      :alt="title"
      :placeholder="placeholder"
      :original="original"
      :is-lewd="isLewd"
      :is-detail="isDetail" />
    <div
      v-if="isLewd && isLewdBlurredLayer"
      class="nsfw-blur is-flex is-align-items-center is-justify-content-center is-flex-direction-column">
      <NeoIcon icon="eye-slash" class="mb-3" />
      <span class="heading-nsfw"> {{ $t('lewd.explicit') }} </span>
      <span class="nsfw-desc">{{ $t('lewd.explicitDesc') }}</span>
    </div>
    <NeoButton
      v-if="isLewd"
      rounded
      no-shadow
      class="nsfw-action px-4 py-1 is-size-6"
      :class="[isLewdBlurredLayer ? '' : 'hide']"
      :label="
        isLewdBlurredLayer ? $t('lewd.showContent') : $t('lewd.hideContent')
      "
      @click.native="toggleContent" />
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
  }
)

let fileType = ref('image')
let isLewdBlurredLayer = ref<boolean>(props.isLewd)
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
  const type = props.mimeType || fileType.value
  return components[resolveMedia(type) + SUFFIX]
})
const properSrc = computed(() => props.src || props.placeholder)

watch(
  () => props.animationSrc,
  () => updateComponent()
)
onMounted(() => {
  updateComponent()
})
const updateComponent = async () => {
  if (props.animationSrc && !props.mimeType) {
    fileType.value = await getMimeType(props.animationSrc)
  }
}
const toggleContent = () => {
  isLewdBlurredLayer.value = !isLewdBlurredLayer.value
}

defineExpose({ isLewdBlurredLayer })
</script>

<style lang="scss" scoped>
@import '@/styles/abstracts/variables';
@import '@/styles/abstracts/mixins';
.media-object {
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
  }
  .nsfw-action {
    border: none;
    @include set-position('bottom', 'center');
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
