<template>
  <div data-testid="type-audio">
    <NeoImageMedia
      v-if="playerCover"
      ref="cover"
      :src="playerCover"
      :placeholder="placeholder"
      :alt="alt"
      :original="original"
    />

    <AudioPlayer
      v-show="!hoverOnCoverPlay"
      ref="audioPlayer"
      :src="src || animationSrc"
      class="w-full border-t border-t-border-color"
    />
  </div>
</template>

<script lang="ts" setup>
import { useElementHover, watchDebounced } from '@vueuse/core'
import { NeoImageMedia } from '@kodadot1/brick'

const props = withDefaults(
  defineProps<{
    src?: string
    animationSrc?: string
    playerCover?: string
    hoverOnCoverPlay?: boolean
    parentHovering?: boolean

    // image media props
    alt?: string
    original: boolean
    placeholder: string
  }>(),
  {
    parentHovering: undefined,
    alt: '',
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
      hovering => handleCoverHover(Boolean(hovering)),
      { debounce: computed(() => (props.parentHovering ? hoverDelay : 0)) },
    )
  }
  else {
    watch(coverHovering, hovering => handleCoverHover(hovering))
  }
}

const handleCoverHover = async (hovering: boolean) => {
  try {
    if (hovering) {
      await audioPlayer.value.play()
    }
    else {
      await audioPlayer.value.pause()
    }
  }
  catch (error) {
    console.error('Error playing audio', error)
  }
}
</script>
