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
import { ref, watch, withDefaults } from 'vue'
import { useElementHover, watchDebounced } from '@vueuse/core'
import { NeoAudioPlayer } from '@kodadot1/brick'
import ImageMedia from './ImageMedia.vue'

const props = withDefaults(
  defineProps<{
    animationSrc?: string
    playerCover?: string
    hoverOnCoverPlay?: boolean
    parentHovering?: boolean

    // image media props
    alt?: string
    original: boolean
    placeholder: string
    isDetail?: boolean
    isDarkMode?: boolean
  }>(),
  {
    parentHovering: undefined,
  },
)

const cover = ref()
const audioPlayer = ref()

const hoverDelay = 1000

const coverHovering = useElementHover(cover, { delayEnter: hoverDelay })

if (props.hoverOnCoverPlay) {
  if (props.parentHovering !== undefined) {
    watchDebounced(
      () => props.parentHovering,
      (hovering) => handleCoverHover(hovering),
      { debounce: computed(() => (props.parentHovering ? hoverDelay : 0)) },
    )
  } else {
    watch(coverHovering, (hovering) => handleCoverHover(hovering))
  }
}

const handleCoverHover = async (hovering: boolean) => {
  try {
    if (hovering) {
      await audioPlayer.value.play()
    } else {
      await audioPlayer.value.pause()
    }
  } catch (error) {}
}
</script>
