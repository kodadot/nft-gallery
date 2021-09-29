
<template>
  <div>
    <av-waveform
    class="media-audio__player"
      :audio-src="src"
      audio-class="media-audio__audio"
      canv-class="media-audio__canvas"
      played-line-color="rgba(0,0,0,0.74)"
      noplayed-line-color="#d32e79"
      playtime-font-color="rgba(0,0,0,0.74)"
    ></av-waveform>
    <!-- <audio controls class="media-audio__player">
      <source :src="src" :type="mimeType" />
      Unable to show audio
    </audio> -->
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
@Component({})
export default class AppAudio extends Vue {
  @Prop() public src!: string;
  @Prop() public mimeType!: string;
}
</script>

<style>
div.media-audio__player div > canvas.media-audio__canvas,
div.media-audio__player > div > audio.media-audio__audio {
  width: 100% !important;
}

</style>
