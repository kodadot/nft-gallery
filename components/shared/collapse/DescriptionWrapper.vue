<template>
  <div>
    <div
      :style="{ maxHeight: `${rowHeight}px` }"
      :class="{
        'description-wrapper': activeWrapper && hasWrapper,
        'row-one': row === 1 && activeWrapper && hasWrapper,
      }">
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
import { Component, Vue, Prop } from 'nuxt-property-decorator'

const components = {
  VueMarkdown: () => import('vue-markdown-render'),
}

@Component({ components })
export default class DescriptionWrapper extends Vue {
  @Prop(String) public text!: string
  @Prop(Number) public rowHeight = 130
  protected activeWrapper = true
  private maxCharsWrapper = 125

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
