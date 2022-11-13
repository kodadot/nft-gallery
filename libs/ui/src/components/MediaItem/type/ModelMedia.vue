<template>
  <div class="view-model__wrapper">
    <div class="view-model__overflow" />
    <model-viewer
      class="view-model__component"
      :src="animationSrc"
      auto-rotate
      ar-modes="webxr scene-viewer quick-look"
      shadow-intensity="1"
      autoplay
      camera-controls
      data-cy="type-3d" />
  </div>
</template>

<script lang="ts" setup>
import '@google/model-viewer'

defineProps<{
  animationSrc: string
}>()
</script>

<style lang="scss" scoped>
.view-model {
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
    --poster-color: transparent;
    --progress-bar-color: lightpink;
  }
}
</style>
