
<template>
  <div>
    <audio controls class="media-audio__player">
      <source :src="src" :type="mimeType" />
      Unable to show audio
    </audio>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
@Component({})
export default class AppAudio extends Vue {
  @Prop() public src!: string;
  @Prop() public mimeType!: string;
}
</script>

<style scoped>
.media-audio__player {
  width: 100%;
}
</style>
