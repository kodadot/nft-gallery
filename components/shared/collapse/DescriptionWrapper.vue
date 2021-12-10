<template>
  <div>
    <div :class="{'description-wrapper': activeWrapper && hasWrapper}">
      <VueMarkdown :source="text" />
    </div>
    <a @click.prevent="toggleDescription" v-if="hasWrapper">
      <b-icon
        :icon="activeWrapper ? 'chevron-down' : 'chevron-up'"
      ></b-icon>
    </a>
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
  protected activeWrapper: boolean = true
  private maxCharsWrapper: number = 125

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
  max-height: 130px;
  word-break: break-word;
  mask: linear-gradient(rgb(255, 255, 255) 45%, transparent);
}
</style>
