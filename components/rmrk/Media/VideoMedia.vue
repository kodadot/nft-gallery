<template>
  <div class="video__wrapper">
    <div class="video__overflow"></div>
    <video
      class="video__component"
      :controls="controls"
      playsinline
      loop
      autoplay
      :muted="preview"
      :src="src"
      :poster="poster"
      :type="mimeType"
      controlslist="nodownload" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({})
export default class VideoMedia extends Vue {
  @Prop(String) public src!: string
  @Prop(String) public poster?: string
  @Prop(String) public mimeType!: string
  @Prop(Boolean) public preview!: boolean

  get controls(): boolean {
    return !this.preview
  }
}
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
