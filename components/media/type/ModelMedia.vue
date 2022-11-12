<template>
  <div class="view-model__wrapper">
    <div class="view-model__overflow"></div>
    <model-viewer
      class="view-model__component"
      :src="src"
      :poster="poster"
      :alt="description"
      :available-animations="availableAnimations"
      auto-rotate
      :camera-controls="isDetail"
      :ar="isDetail"
      ar-modes="webxr scene-viewer quick-look"
      shadow-intensity="1"
      autoplay
      data-cy="type-3d">
      <button v-if="withARButton" id="ar-button" slot="ar-button">
        Activate AR
      </button>
    </model-viewer>
  </div>
</template>

<script lang="ts" setup>
import '@google/model-viewer'

const props = defineProps({
  src: { type: String, default: '' },
  poster: { type: String, default: '' },
  description: { type: String, default: '' },
  availableAnimations: { type: Array, default: () => [] },
  preview: Boolean,
  withARButton: { type: Boolean, default: true },
})

const isDetail = computed(() => !props.preview)
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
