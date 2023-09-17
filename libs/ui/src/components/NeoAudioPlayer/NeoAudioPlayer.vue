<template>
  <div ref="player">
    <audio ref="audio" />

    <div
      class="px-6 py-5 is-flex is-justify-items-center is-align-items-center">
      <div>
        <NeoButton
          :loading="playDisabled"
          :disabled="playDisabled"
          class="button-size"
          no-shadow
          rounded
          variant="border-icon"
          @click.native="togglePlay">
          <NeoIcon
            v-if="!playDisabled"
            :icon="playing ? 'pause' : 'play'"
            custom-size="fa-solid"
            pack="fa-sharp" />
        </NeoButton>
      </div>

      <div
        class="ml-4 duration"
        :class="{ 'is-clickable': canPlay }"
        @click="goToEnd">
        {{ formattedDuration }}
      </div>

      <div class="ml-4 bar w-full">
        <ProgressBar
          :current-time="currentTime"
          :total-time="duration"
          rounded
          @change="change" />
      </div>

      <div class="ml-4">
        <NeoButton
          class="button-size ml-1"
          no-shadow
          rounded
          variant="border-icon"
          @click.native="toggleMute">
          <NeoIcon
            :icon="muted ? 'volume' : 'volume-slash'"
            custom-size="fa-solid"
            pack="fa-sharp" />
        </NeoButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useEventListener, useMediaControls } from '@vueuse/core'
import { NeoButton, NeoIcon } from '@kodadot1/brick'
import ProgressBar from './ProgressBar/ProgressBar.vue'

const props = defineProps<{
  src?: string
}>()

const player = ref()
const audio = ref()
const loading = ref(false)
const canPlay = ref(false)

const { playing, currentTime, duration, muted } = useMediaControls(audio, {
  src: props.src,
})

const playDisabled = computed(() => !canPlay.value || loading.value)

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

const playTime = async (time: number) => {
  loading.value = true
  audio.value.currentTime = time
  await play()
  loading.value = false
}

const change = (time: number) => {
  playTime(time)
}

const toggleMute = () => {
  audio.value.muted = !muted.value
}

const goToEnd = () => {
  if (!canPlay.value) {
    return
  }
  playTime(duration.value)
}

useEventListener(audio, 'canplaythrough', () => {
  canPlay.value = true
})

defineExpose({ play, pause, playing })

// useEventListener(audio, 'timeupdate',  function() {
//   if (audio.value.buffered.length > 0) {
//     const bufferedEnd = audio.value.buffered.end(0); // Get the end time of the buffered range
//     if (bufferedEnd >= audio.value.currentTime) {
//       // The audio is not buffering anymore; it has started playing
//       console.log('Audio is playing');
//     } else {
//       // The audio is still buffering
//       console.log('Audio is buffering');
//     }
//   }
// })
</script>

<style>
.duration {
  display: inline-block;
  min-width: 40px;
}

.bar {
  height: 0.8rem;
}

.button-size {
  height: 33px;
  width: 33px;
}
</style>
