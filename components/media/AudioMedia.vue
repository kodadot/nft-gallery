<script lang="ts" setup>
import { defineProps } from '#app'

defineProps<{
  src?: string
  mimeType?: string
}>()
</script>

<template>
  <div>
    <av-waveform
      class="media-audio__player"
      :audio-src="src"
      audio-class="media-audio__audio"
      canv-class="media-audio__canvas"
      played-line-color="rgba(0,0,0,0.74)"
      noplayed-line-color="#d32e79"
      playtime-font-color="rgba(0,0,0,0.74)" />
  </div>
</template>

<style>
div.media-audio__player div > canvas.media-audio__canvas,
div.media-audio__player > div > audio.media-audio__audio {
  width: 100% !important;
}
</style>
