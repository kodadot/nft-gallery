<template>
  <button
    v-if="showBtn"
    class="scroll-top-button button is-justify-content-center"
    @click="scrollToTop">
    <NeoIcon icon="chevron-up" />
  </button>
</template>

<script setup lang="ts">
import { SHOW_SCROLL_TOP_BUTTON_HEIGHT } from '@/utils/constants'
import { NeoIcon } from '@kodadot1/brick'
import { useEventListener } from '@vueuse/core'
const showBtn = ref(false)

const onScroll = () => {
  showBtn.value =
    document.documentElement.scrollTop > SHOW_SCROLL_TOP_BUTTON_HEIGHT
}

useEventListener(window, 'scroll', onScroll)

const scrollToTop = () => {
  window.scroll({
    top: 0,
    behavior: 'smooth',
  })
}
</script>
