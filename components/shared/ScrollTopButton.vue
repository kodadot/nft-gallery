<template>
  <a
    v-if="showBtn"
    class="scroll-top-button button is-justify-content-center"
    @click="scrollToTop">
    <NeoIcon icon="chevron-up" />
  </a>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Debounce } from 'vue-debounce-decorator'
import { SHOW_SCROLL_TOP_BUTTON_HEIGHT } from '@/utils/constants'
import { NeoIcon } from '@kodadot1/brick'

@Component({
  components: {
    NeoIcon,
  },
})
export default class ScrollTopButton extends Vue {
  public showBtn = false

  protected mounted() {
    window.addEventListener('scroll', this.onScroll)
  }

  protected beforeDestroy() {
    window.removeEventListener('scroll', this.onScroll)
  }

  @Debounce(100)
  protected onScroll(): void {
    this.showBtn =
      document.documentElement.scrollTop > SHOW_SCROLL_TOP_BUTTON_HEIGHT
  }

  public scrollToTop = () => {
    window.scroll({
      top: 0,
      behavior: 'smooth',
    })
  }
}
</script>
