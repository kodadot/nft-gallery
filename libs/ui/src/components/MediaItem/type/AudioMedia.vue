<template>
  <div ref="audioMedia" data-testid="type-audio">
    <ImageMedia
      v-if="playerCover"
      ref="cover"
      :src="playerCover"
      :placeholder="placeholder"
      :alt="alt"
      :is-detail="isDetail"
      :original="original"
      :is-dark-mode="isDarkMode" />

    <NeoAudioPlayer
      v-show="!hoverOnCoverPlay"
      ref="audioPlayer"
      :src="animationSrc"
      class="w-full border-top" />
  </div>
</template>

<script lang="ts" setup>
import { NeoAudioPlayer } from '@kodadot1/brick'
import ImageMedia from './ImageMedia.vue'
import { useElementHover, useIntersectionObserver } from '@vueuse/core'

const props = defineProps<{
  animationSrc?: string
  playerCover?: string
  hoverOnCoverPlay?: boolean
  pauseOnHorizontalHidden?: boolean

  // image media props
  alt?: string
  original: boolean
  placeholder: string
  isDetail?: boolean
  isDarkMode?: boolean
}>()

const audioMedia = ref()
const cover = ref()
const audioPlayer = ref()
const playing = computed(() => audioPlayer.value?.playing)

const coverHovering = useElementHover(cover, { delayEnter: 1000 })

if (props.hoverOnCoverPlay) {
  watch(coverHovering, () => handleCoverHover())
}

if (props.pauseOnHorizontalHidden) {
  useIntersectionObserver(
    audioMedia,
    async ([entry]: IntersectionObserverEntry[]) => {
      if (
        playing.value &&
        !entry.isIntersecting &&
        entry.intersectionRect.width < entry.intersectionRect.height
      ) {
        await audioPlayer.value.pause()
      }
    }
  )
}

const handleCoverHover = async () => {
  try {
    if (coverHovering.value) {
      await audioPlayer.value.play()
    } else {
      await audioPlayer.value.pause()
    }
  } catch (error) {}
}
</script>
