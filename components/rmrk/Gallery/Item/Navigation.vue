<template>
  <div class="navigation-container">
        <b-button
          tag="nuxt-link"
          icon-left="chevron-left"
          :to="`/rmrk/gallery/${this.items[this.prevIndex]}`"
          outlined
        />
        <b-button
          tag="nuxt-link"
          icon-left="chevron-right"
          :to="`/rmrk/gallery/${this.items[this.nextIndex]}`"
          outlined
        />
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue } from 'nuxt-property-decorator'

const components = {
  ProfileLink: () => import('@/components/rmrk/Profile/ProfileLink.vue')
}

@Component({ components })
export default class Navigation extends Vue {
  @Prop({type: Array}) readonly items!: string[];

  @Prop({type: String}) readonly currentId!: string;

  get indexOfCurrentId(): number {
    return this.items.indexOf(this.currentId);
  }

  get nextIndex(): number {
    // check if current item is last item of array
    return (this.indexOfCurrentId === this.items.length - 1) ? 0 : this.indexOfCurrentId + 1;
  }

  get prevIndex(): number {
    // check if current item is first item of array
    return this.indexOfCurrentId === 0 ? this.items.length - 1 : this.indexOfCurrentId - 1;
  }

  mounted() {
    document.addEventListener('keyup', this.handleKeyEvent);

  }

  beforeDestroy() {
    document.removeEventListener('keyup', this.handleKeyEvent);
  }

  handleKeyEvent(event) {
    switch (event.key) {
      case "ArrowLeft":
          this.gotoNextItem(true)
          break;
      case "ArrowRight":
          this.gotoNextItem(false)
          break;
    }
  }

  gotoNextItem(reverse: boolean) {
    this.$router.push(`/rmrk/gallery/${this.items[reverse ? this.prevIndex : this.nextIndex]}`)
  }
}
</script>

<style scoped>
.navigation-container {
    position: absolute;
    top: 0px;
    right: 0px;
    bottom: 0px;
    left: 0px;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: space-between;
}
</style>
