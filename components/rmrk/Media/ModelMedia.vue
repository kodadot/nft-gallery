<template>
  <div class="view-model__wrapper">
    <div class="view-model__overflow"></div>
    <model-viewer
      class="view-model__component"
      :src="src"
      :poster="poster"
      :alt="description"
      :availableAnimations="availableAnimations"
      auto-rotate
      :camera-controls="isDetail"
      :ar="isDetail"
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
  @Prop(Boolean) public preview!: boolean

  get isDetail(): boolean {
    return !this.preview
  }
}
</script>

<style lang="scss" scoped>
.view-model {
  &__wrapper {
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
