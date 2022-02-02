<template>
  <video
    :controls="controls"
    playsinline
    loop
    autoplay
    :muted="preview"
    :src="src"
    :poster="poster"
    :type="mimeType"
    controlslist="nodownload" />
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
