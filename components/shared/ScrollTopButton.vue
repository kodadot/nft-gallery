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

const showBtn = ref(false)

onMounted(() => {
  window.addEventListener('scroll', onScroll)
})
onBeforeMount(() => {
  window.removeEventListener('scroll', onScroll)
})

const onScroll = () => {
  showBtn.value =
    document.documentElement.scrollTop > SHOW_SCROLL_TOP_BUTTON_HEIGHT
}

const scrollToTop = () => {
  window.scroll({
    top: 0,
    behavior: 'smooth',
  })
}
</script>
