<template>
  <av-waveform
    class="media-audio__player is-flex is-flex-direction-column-reverse"
    :audio-src="animationSrc"
    audio-class="media-audio__audio"
    canv-class="media-audio__canvas"
    played-line-color="rgba(0,0,0,0.74)"
    noplayed-line-color="#d32e79"
    playtime-font-color="rgba(0,0,0,0.74)"
    data-cy="type-audio" />
</template>

<script lang="ts" setup>
import AvWaveform from 'vue-audio-visual/src/components/AvWaveform'

defineProps<{
  animationSrc?: string
}>()
</script>

<style>
div.media-audio__player {
  height: 100%;
}
div.media-audio__player div > canvas.media-audio__canvas,
div.media-audio__player > div > audio.media-audio__audio {
  width: 100% !important;
}
</style>
