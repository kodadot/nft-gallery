<template>
  <div>
    <div
      :style="[
        activeWrapper && hasWrapper ? { maxHeight: `${rowHeight}px` } : null,
      ]"
      :class="{ 'description-wrapper': activeWrapper && hasWrapper }">
      <VueMarkdown :source="text" />
    </div>
    <div class="has-text-centered">
      <a @click.prevent="toggleDescription" v-if="hasWrapper">
        <b-icon :icon="activeWrapper ? 'chevron-down' : 'chevron-up'"></b-icon>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import KeyboardEventsMixin from '~/utils/mixins/keyboardEventsMixin'

const components = {
  VueMarkdown: () => import('vue-markdown-render'),
}

@Component({ components })
export default class DescriptionWrapper extends mixins(KeyboardEventsMixin) {
  @Prop(String) public text!: string
  @Prop({ type: Number, default: 130 }) public rowHeight!: number
  protected activeWrapper = true
  private maxCharsWrapper = 125

  public async created() {
    this.initKeyboardEventHandler({
      e: this.bindExpandEvents,
    })
  }

  private bindExpandEvents(event) {
    if (event.key === 'd') {
      this.toggleDescription()
    }
  }

  get hasWrapper(): boolean {
    return this.text.length > this.maxCharsWrapper
  }

  protected toggleDescription(): void {
    this.activeWrapper = !this.activeWrapper
  }
}
</script>
<style>
.description-wrapper {
  word-break: break-word;
  mask: linear-gradient(rgb(255, 255, 255) 45%, transparent);
}
</style>
