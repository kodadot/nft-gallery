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
    <button
      v-if="isLewd"
      class="nsfw-action px-4 py-1"
      :class="[isLewdBlurredLayer ? '' : 'hide']"
      @click="toggleContent">
      {{ isLewdBlurredLayer ? $t('lewd.showContent') : $t('lewd.hideContent') }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import { getMimeType, resolveMedia } from '@/utils/gallery/media'
import { NeoIcon } from '@kodadot1/brick'

const SUFFIX = 'Media'
const props = withDefaults(
  defineProps<{
    src: string
    animationSrc: string
    mimeType: string
    title: string
    original?: boolean
    isLewd?: boolean
    isDetail?: boolean
    placeholder: string
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

let defaultMimeType = ref('image')
let isLewdBlurredLayer = ref<boolean>(props.isLewd)
const components = {
  ImageMedia: defineAsyncComponent(() => import('./type/ImageMedia.vue')),
  VideoMedia: defineAsyncComponent(() => import('./type/VideoMedia.vue')),
  AudioMedia: defineAsyncComponent(() => import('./type/AudioMedia.vue')),
  ModelMedia: defineAsyncComponent(() => import('./type/ModelMedia.vue')),
  JsonMedia: defineAsyncComponent(() => import('./type/JsonMedia.vue')),
  IFrameMedia: defineAsyncComponent(() => import('./type/IFrameMedia.vue')),
  ObjectMedia: defineAsyncComponent(() => import('./type/ObjectMedia.vue')),
  Media: defineAsyncComponent(() => import('./type/UnknownMedia.vue')),
}

const resolveComponent = computed(() => {
  const type = props.mimeType || defaultMimeType.value
  return components[resolveMedia(type) + SUFFIX]
})
const properSrc = computed(() => {
  return props.src || props.placeholder
})

watch(
  () => props.animationSrc,
  () => updateComponent()
)
onMounted(() => {
  updateComponent()
})
const updateComponent = async () => {
  if (props.animationSrc && !props.mimeType) {
    defaultMimeType.value = await getMimeType(props.animationSrc)
  }
}
const toggleContent = () => {
  isLewdBlurredLayer.value = !isLewdBlurredLayer.value
}

defineExpose({ isLewdBlurredLayer })
</script>

<style lang="scss" scoped>
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
  cursor: pointer;
  bottom: 3.125rem;
  left: 50%;
  transform: translate(-50%);
  font-size: 1rem;
  position: absolute;
  border-radius: 1.5rem;
  border: none;
  background: #fff;
  color: #000;
  &.hide {
    background: #000;
    color: #fff;
  }
}
</style>
