<template>
  <div>
    <div
      :style="[
        activeWrapper && hasWrapper ? { maxHeight: `${rowHeight}px` } : null,
      ]"
      :class="{ 'description-wrapper': activeWrapper && hasWrapper }">
      <Markdown :source="text" />
    </div>
    <div class="has-text-centered">
      <a v-if="hasWrapper" @click.prevent="toggleDescription">
        <NeoIcon
          :icon="activeWrapper ? 'chevron-down' : 'chevron-up'"></NeoIcon>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import KeyboardEventsMixin from '~/utils/mixins/keyboardEventsMixin'
import Markdown from '@/components/shared/Markdown'
import { NeoIcon } from '@kodadot1/brick'

const components = {
  Markdown,
  NeoIcon,
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

  public mounted() {
    useRedirectModal('.markdown-wrapper')
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
  pointer-events: none; /* unclickable */
}
</style>
