<template>
  <div ref="player">
    <!-- <av-waveform ref-link="player" class="media-audio__player is-flex is-flex-direction-column-reverse"
            :audio-src="animationSrc" audio-class="media-audio__audio" canv-class="media-audio__canvas"
            played-line-color="black" noplayed-line-color="#a3a3a3" :audio-controls="false" :playtime="false"
            data-testid="type-audio" /> -->

    <audio ref="audio" />

    <div
      class="px-6 py-5 is-flex is-justify-items-center is-align-items-center">
      <div>
        <NeoButton
          :disabled="!canPlay"
          rounded
          no-shadow
          class="p-2"
          @click.native="togglePlay">
          <NeoIcon
            class="ml-1 has-text-color"
            :icon="playing ? 'pause' : 'play'"
            custom-size="fa-solid"
            pack="fa-sharp"
            variant="primary" />
        </NeoButton>
      </div>

      <div class="ml-4 duration">{{ formattedDuration }}</div>

      <div class="ml-4 bar w-full">
        <ProgressBar
          :current-time="currentTime"
          :total-time="duration"
          rounded
          @change="change" />
      </div>

      <div class="ml-4">
        <NeoButton rounded no-shadow @click.native="toggleMute">
          <NeoIcon
            class="ml-1 has-text-color"
            :icon="muted ? 'volume' : 'volume-slash'"
            custom-size="fa-solid"
            pack="fa-sharp"
            variant="primary" />
        </NeoButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import AvWaveform from 'vue-audio-visual/src/components/AvWaveform'
import { useEventListener, useMediaControls } from '@vueuse/core'
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import ProgressBar from './ProgressBar/ProgressBar.vue'

const props = defineProps<{
  src?: string
}>()

const player = ref()
const audio = ref()

const { playing, currentTime, duration, muted } = useMediaControls(audio, {
  src: props.src,
})
const canPlay = ref(false)

const formattedDuration = computed(() =>
  new Date(currentTime.value * 1000).toISOString().slice(14, 19)
)

const togglePlay = async () => {
  if (playing.value) {
    await pause()
  } else {
    await play()
  }
}

const play = async () => {
  await audio.value.play()
}

const pause = async () => {
  await audio.value.pause()
}

const change = (time: number) => {
  audio.value.currentTime = time
  audio.value.play()
}

const toggleMute = () => {
  audio.value.muted = !muted.value
}

useEventListener(audio, 'canplaythrough', () => {
  canPlay.value = true
})

defineExpose({ play, pause })
</script>

<style>
/* div.media-audio__player {
    height: 100%;
  }
  
  div.media-audio__player div>canvas.media-audio__canvas,
  div.media-audio__player>div>audio.media-audio__audio {
    width: 100% !important;
  } */

.duration {
  display: inline-block;
  min-width: 60px;
}

.bar {
  height: 1rem;
}
</style>
