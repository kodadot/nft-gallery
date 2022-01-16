<template>
  <div class="view-model__wrapper">
    <model-viewer
      id="reveal"
      class="view-model__component"
      :src="src"
      :poster="poster"
      :alt="description"
      :availableAnimations="availableAnimations"
      auto-rotate
      camera-controls
      ar
      ar-modes="webxr scene-viewer quick-look"
      shadow-intensity="1"
      autoplay>
      <button id="ar-button" slot="ar-button">Activate AR</button>
    </model-viewer>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import '@google/model-viewer'

@Component({})
export default class ViewModel extends Vue {
  @Prop({ type: String, default: '' }) public readonly src!: string
  @Prop({ type: String, default: '' }) public readonly poster?: string
  @Prop({ type: String, default: '' }) public readonly description?: string
  @Prop({ type: Array }) public readonly availableAnimations?: string[]

  // get src() {
  //   return 'https://kristina-simakova.github.io/ar-webview/assets/RocketShip_1393.gltf';  // }
}
</script>

<style scoped>
.view-model__wrapper {
  height: 100%;
  width: 100%;
}

.view-model__component {
  height: 100%;
  width: 100%;
  min-width: 300px;
  min-height: 592px;
}

model-viewer#reveal {
  --poster-color: transparent;
}
</style>
