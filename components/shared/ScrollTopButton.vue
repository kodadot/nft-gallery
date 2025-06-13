<template>
  <NeoButton
    v-show="showBtn"
    class="scroll-top-button"
    icon="chevron-up"
    @click="scrollToTop"
  />
</template>

<script setup lang="ts">
import { NeoButton } from '@kodadot1/brick'
import { useEventListener } from '@vueuse/core'
import { SHOW_SCROLL_TOP_BUTTON_HEIGHT } from '@/utils/constants'

const showBtn = ref(false)

const onScroll = () => {
  showBtn.value
    = document.documentElement.scrollTop > SHOW_SCROLL_TOP_BUTTON_HEIGHT
}

useEventListener(window, 'scroll', onScroll)

const scrollToTop = () => {
  window.scroll({
    top: 0,
    behavior: 'smooth',
  })
}
</script>

<style scoped>
@reference '@/assets/css/tailwind.css';

.scroll-top-button {
  @apply fixed w-[35px] h-[35px] z-998 rounded-none right-[42px] bottom-[100px];

  box-shadow: var(--primary-shadow);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  background: var(--background-color);

  &:hover {
    background: var(--k-accent-hover);
    .icon {
      color: var(--black) !important;
    }
  }
}
</style>
