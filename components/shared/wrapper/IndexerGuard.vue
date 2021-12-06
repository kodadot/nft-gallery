<template>
  <div>
    <slot v-if="healthy" />
    <p
      v-else-if="showMessage"
      class="has-text-warning"
    >
      {{ $t('general.indexerReadOnly') }}
    </p>
  </div>
</template>

<script lang="ts">
import IndexerMixin from '@/utils/mixins/indexerMixin'
import { Component, mixins, Prop } from 'nuxt-property-decorator'

@Component
export default class EmptyGuard extends mixins(IndexerMixin) {
  @Prop(Boolean) public showMessage!: boolean;
  // @Prop({ type: String, default: 'indexer.sick' }) public showMessage!: string;

  public mounted() {
    this.$store.dispatch('indexer/fetchIndexer')
  }
}
</script>

