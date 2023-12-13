<template>
  <div ref="player">
    <audio ref="audio" :src="src" />

    <div class="px-6 py-5 flex justify-items-center items-center">
      <div>
        <NeoButton
          :loading="playDisabled"
          :disabled="playDisabled"
          class="button-size"
          no-shadow
          rounded
          variant="border-icon"
          @click="togglePlay">
          <NeoIcon
            v-if="!playDisabled"
            :icon="playing ? 'pause' : 'play'"
            custom-size="fa-solid"
            pack="fass" />
        </NeoButton>
      </div>

      <div
        class="ml-4 duration"
        :class="{ 'is-clickable': canStartPlaying }"
        @click="goToEnd">
        {{ formattedDuration }}
      </div>

      <div
        class="ml-4 w-full"
        :class="{
          'flex items-center justify-items-center': !isWaveformReady,
        }">
        <NeoWaveform
          v-show="isWaveformReady"
          :class="{
            'is-clickable': canStartPlaying,
          }"
          :get-media="() => $refs.audio"
          @play="play"
          @ready="isWaveformReady = true" />
        <NeoSkeleton v-if="!isWaveformReady" no-margin rounded height="100%" />
      </div>

      <div class="ml-4">
        <NeoButton
          class="button-size ml-1"
          no-shadow
          rounded
          variant="border-icon"
          @click="toggleMute">
          <NeoIcon :icon="muted ? 'volume-slash' : 'volume'" pack="fass" />
        </NeoButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useEventListener, useMediaControls } from '@vueuse/core'
import { NeoButton, NeoIcon, NeoSkeleton } from '@kodadot1/brick'
import { getRandomValues } from '@/components/unique/utils'
import NeoWaveform from './NeoWaveform.vue'

defineProps<{
  src?: string
}>()

const { eventBus: playerEventBus, unsubscribe: unsubscribePlayerEventBus } =
  usePlayerEventBus()

const audio = ref()
const player = ref()
const loading = ref(false)
const canStartPlaying = ref(false)
const isWaveformReady = ref(false)

const id = ref(getRandomValues(1)[0])

const actionStack = ref<
  { promise: Promise<void>; reject: (reason?: any) => void }[]
>([])

const { playing, currentTime, duration, muted } = useMediaControls(audio)

const playDisabled = computed(() => !canStartPlaying.value || loading.value)
const canPause = computed(() => !audio.value.paused || playing.value)
const canPlay = computed(() => audio.value.paused || !playing.value)

const formattedDuration = computed(() => {
  const time = new Date(currentTime.value * 1000).toISOString().slice(14, 19)
  return time.startsWith('0') ? time.slice(1, 5) : time
})

const togglePlay = async () => {
  if (playing.value) {
    await pause()
  } else {
    await play()
  }
}

const flushPreviouseActions = async () => {
  try {
    await Promise.allSettled(actionStack.value.map((action) => action.reject()))
    actionStack.value = []
  } catch (error) {}
}

const pushToActionStack = ({ promise, reject }) => {
  actionStack.value.push({
    promise,
    reject,
  })
}

const play = (time?: number) => {
  return new Promise((resolve, reject) => {
    if (!canPlay.value) {
      return reject(new Error("Player: Can't play"))
    }
    flushPreviouseActions()
      .then(() => {
        loading.value = true

        if (time) {
          audio.value.currentTime = time
        }

        const playPromise: Promise<any> = audio.value.play()

        playPromise
          .then(() => {
            playerEventBus.emit(PlayerEvent.PLAY, { id: id.value })
            resolve(true)
          })
          .catch(reject)
          .finally(() => {
            loading.value = false
          })

        pushToActionStack({ promise: playPromise, reject })
      })
      .catch(reject)
  })
}

const pause = async () => {
  return new Promise((resolve, reject) => {
    if (!canPause.value) {
      return reject(new Error("Player: Can't pause"))
    }

    flushPreviouseActions()
      .then(() => {
        audio.value.pause()
        resolve(true)
      })
      .catch(reject)
  })
}

const toggleMute = () => {
  audio.value.muted = !muted.value
}

const goToEnd = () => {
  if (!canStartPlaying.value) {
    return
  }
  play(duration.value)
}

useEventListener(audio, 'canplay', () => {
  canStartPlaying.value = true
  loading.value = false
})

useEventListener(audio, 'waiting', () => {
  loading.value = true
  canStartPlaying.value = false
})

playerEventBus.emit(PlayerEvent.ADD_PLAYER, { id: id.value, pause })

onBeforeUnmount(() => {
  playerEventBus.emit(PlayerEvent.REMOVE_PLAYER, { id: id.value })
  unsubscribePlayerEventBus()
})

defineExpose({ play, pause })
</script>

<style scoped lang="scss">
.duration {
  display: inline-block;
  min-width: 40px;
}

.button-size {
  height: 33px;
  width: 33px;
}
</style>
