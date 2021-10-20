<template>
  <video controls playsinline loop autoplay>
      <source :src="src" :type="mimeType">
      Unable to show video
  </video>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'vue-property-decorator'
@Component({})
export default class VideoMedia extends Vue {
  @Prop() public src!: string;
  @Prop() public mimeType!: string;
}
</script>
