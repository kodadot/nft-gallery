<template>
  <div
    class="navigation-container"
    :class="{ 'is-hidden-desktop': !showNavigation }">
    <b-button
      tag="nuxt-link"
      icon-left="chevron-left"
      :to="properUrl(prevIndex)"
      outlined />
    <b-button
      tag="nuxt-link"
      icon-left="chevron-right"
      :to="properUrl(nextIndex)"
      outlined />
  </div>
</template>

<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import KeyboardEventsMixin from '~/utils/mixins/keyboardEventsMixin'
import PrefixMixin from '~/utils/mixins/prefixMixin'

const components = {
  ProfileLink: () => import('@/components/rmrk/Profile/ProfileLink.vue'),
}

@Component({ components })
export default class Navigation extends mixins(
  KeyboardEventsMixin,
  PrefixMixin
) {
  @Prop({ type: Array }) readonly items!: string[]
  @Prop(Boolean) public showNavigation!: boolean
  @Prop({ type: String }) readonly currentId!: string

  public created() {
    this.initKeyboardEventHandler({
      g: this.bindActionEvents,
    })
  }

  private bindActionEvents(event) {
    switch (event.key) {
      case 'n':
        this.$router.push({
          path: `/rmrk/gallery/${this.items[this.nextIndex]}`,
        })
        break
      case 'p':
        this.$router.push({
          path: `/rmrk/gallery/${this.items[this.prevIndex]}`,
        })
        break
    }
  }

  get indexOfCurrentId(): number {
    return this.items.indexOf(this.currentId)
  }

  get nextIndex(): number {
    // check if current item is last item of array
    return this.indexOfCurrentId === this.items.length - 1
      ? 0
      : this.indexOfCurrentId + 1
  }

  get prevIndex(): number {
    // check if current item is first item of array
    return this.indexOfCurrentId === 0
      ? this.items.length - 1
      : this.indexOfCurrentId - 1
  }

  public mounted() {
    document.addEventListener('keyup', this.handleKeyEvent)
  }

  public beforeDestroy() {
    document.removeEventListener('keyup', this.handleKeyEvent)
  }

  public handleKeyEvent(event) {
    // block navigation to next or prev NFT if any of the following elements is being focused
    const activeElement = document.activeElement
    const inputs = ['input', 'select', 'button', 'textarea']
    if (
      activeElement &&
      inputs.indexOf(activeElement.tagName.toLowerCase()) !== -1
    ) {
      return
    }

    if (event.key === 'ArrowLeft') {
      return this.gotoNextItem(true)
    }
    if (event.key === 'ArrowRight') {
      return this.gotoNextItem(false)
    }
  }

  public gotoNextItem(reverse: boolean) {
    this.$router.push(this.properUrl(reverse ? this.prevIndex : this.nextIndex))
  }

  protected properUrl(index: number) {
    return `/${this.urlPrefix}/gallery/${this.items[index]}`
  }
}
</script>

<style scoped lang="scss">
@import '@/styles/abstracts/variables';

.navigation-container {
  pointer-events: none;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 998;
  @media screen and (max-width: 768px) {
    right: -12px;
    left: -12px;
  }
}
.navigation-container a {
  pointer-events: all;
  border: 0 !important;
  border-top: $sleek-primary-border !important;
  opacity: 0.6;
}
</style>
