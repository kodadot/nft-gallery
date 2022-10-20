<template>
  <span v-if="!hasBlockUrl"> {{ text }}</span>
  <a v-else target="_blank" rel="noopener noreferrer" :href="blockUrl">
    {{ text }}
  </a>
</template>

<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import {
  BLOCK_EXPLORER_WITH_QUERY,
  blockExplorerOf,
} from '@/utils/config/chain.config'
import PrefixMixin from '@/utils/mixins/prefixMixin'

const components = {}

@Component({ components })
export default class BlockExplorerLink extends mixins(PrefixMixin) {
  @Prop({ type: String, default: 'subscan' }) public provider!: string
  @Prop({ type: String, required: true }) public blockId!: string
  @Prop({ type: String, required: true }) public text!: string

  get blockUrl(): string {
    if (!this.hasBlockUrl || !this.blockId) {
      return '#'
    }
    if (BLOCK_EXPLORER_WITH_QUERY.includes(this.urlPrefix)) {
      return this.blockExplorer + this.blockId
    }
    return this.blockExplorer + 'block/' + this.blockId
  }

  get blockExplorer(): string | undefined {
    return blockExplorerOf(this.urlPrefix)
  }

  get hasBlockUrl(): boolean {
    return Boolean(this.blockExplorer)
  }
}
</script>

<style scoped></style>
