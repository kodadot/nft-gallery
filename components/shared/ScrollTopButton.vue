<template>
  <a
    v-if="showBtn"
    class="scroll-top-button button is-rounded"
    @click="scrollToTop">
    <b-icon icon="chevron-up" />
  </a>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Debounce } from 'vue-debounce-decorator'
import { SHOW_SCROLL_TOP_BUTTON_HEIGHT } from '@/utils/constants'

@Component({})
export default class ScrollTopButton extends Vue {
  private showBtn = false

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

  private scrollToTop = () => {
    window.scroll({
      top: 0,
      behavior: 'smooth',
    })
  }
}
</script>
<style lang="scss" scoped>
.scroll-top-button {
  position: fixed;
  right: 20px;
  bottom: 100px;
  width: 56px;
  height: 56px;
  z-index: 998;
}
</style>
