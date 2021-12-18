<template>
  <video
    width="400"
    controls
  >
    <source
      :src="src"
      :type="mimeType"
    >
    Unable to show audio
  </video>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({})
export default class VideoMedia extends Vue {
  @Prop() public src!: string
  @Prop() public mimeType!: string
}
</script>
