<template>
  <div class="video__wrapper">
    <div class="video__overflow" />
    <video
      class="video__component"
      :controls="controls"
      playsinline
      loop
      autoplay
      :muted="preview"
      :src="animationSrc || src"
      controlslist="nodownload"
      data-testid="type-video"
      :title="alt" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    animationSrc?: string
    src?: string
    alt?: string
    preview?: boolean
  }>(),
  {
    animationSrc: '',
    src: '',
    alt: '',
    preview: true,
  },
)

const controls = computed(() => !props.preview)
</script>

<style lang="scss" scoped>
.video {
  &__wrapper {
    height: 100%;
    width: 100%;
    z-index: 1;
    min-width: 0;
    position: relative;
    box-sizing: border-box;
  }

  &__overflow {
    height: 0;
    width: 100%;
    padding-bottom: 100%;
  }

  &__component {
    inset: 0;
    min-width: 0;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    position: absolute;
    box-sizing: border-box;
    -moz-box-align: center;
    -moz-box-pack: center;
    justify-content: center;
  }
}
</style>
