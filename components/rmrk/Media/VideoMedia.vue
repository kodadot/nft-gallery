<template>
  <video
    controls
    playsinline
    loop
    autoplay
    :src="src"
    :poster="poster"
    :type="mimeType" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
@Component({})
export default class VideoMedia extends Vue {
  @Prop(String) public src!: string
  @Prop(String) public poster?: string
  @Prop(String) public mimeType!: string
}
</script>
