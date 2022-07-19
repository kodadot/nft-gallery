<template>
  <span v-if="hasDisabledBlockUrl"> {{ text }}</span>
  <a
    v-else
    target="_blank"
    rel="noopener noreferrer"
    :href="getBlockUrl(blockId)">
    {{ text }}
  </a>
</template>

<script lang="ts">
import { Component, mixins, Prop } from 'nuxt-property-decorator'
import { urlBuilderBlockNumber } from '@/utils/explorerGuide'
import PrefixMixin from '~/utils/mixins/prefixMixin'

const components = {}

@Component({ components })
export default class BlockExplorerLink extends mixins(PrefixMixin) {
  @Prop({ type: String, default: 'subscan' }) public provider!: string
  @Prop({ type: String, required: true }) public blockId!: string
  @Prop({ type: String, required: true }) public text!: string

  public getBlockUrl(block: string): string {
    return urlBuilderBlockNumber(
      block,
      this.$store.getters['explorer/getCurrentChain'],
      this.provider
    )
  }

  get hasDisabledBlockUrl(): boolean {
    const disableBlockUrlPrefix = ['bsx']
    return disableBlockUrlPrefix.includes(this.urlPrefix)
  }
}
</script>

<style scoped></style>
