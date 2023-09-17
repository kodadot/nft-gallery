<template>
  <div data-testid="type-audio">
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
import { useElementHover } from '@vueuse/core'

const props = defineProps<{
  animationSrc?: string
  playerCover?: string
  hoverOnCoverPlay?: boolean

  // image media props
  alt?: string
  original: boolean
  placeholder: string
  isDetail?: boolean
  isDarkMode?: boolean
}>()

const cover = ref()
const audioPlayer = ref()

const coverHovering = useElementHover(cover, { delayEnter: 1000 })

if (props.hoverOnCoverPlay) {
  watch(coverHovering, () => handleCoverHover())
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
