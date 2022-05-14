<template>
  <div v-if="showBtn" class="scroll-top-button" @click="scrollToTop">
    <b-icon icon="arrow-alt-circle-up" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Debounce } from 'vue-debounce-decorator'

const SHOW_SCROLL_TOP_BUTTON_HEIGHT = 2000

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
<style lang="scss">
@import '@/styles/variables';

.scroll-top-button {
  position: fixed;
  right: 20px;
  bottom: 100px;
  z-index: 999999999;
  &:hover {
    color: $primary;
    cursor: pointer;
  }
  .icon svg {
    width: 30px;
    height: 30px;
  }
}
</style>
