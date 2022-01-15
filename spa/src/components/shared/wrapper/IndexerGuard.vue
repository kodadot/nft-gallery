<template>
  <div>
    <slot v-if="healthy" />
    <p v-else-if="showMessage" class="has-text-warning">
       {{ $t('general.indexerReadOnly') }}
    </p>
  </div>
</template>

<script lang="ts">
import IndexerMixin from '@/utils/mixins/indexerMixin'
import { Component, Mixins, Prop } from 'vue-property-decorator'

@Component
export default class EmptyGuard extends Mixins(IndexerMixin) {
    @Prop(Boolean) public showMessage!: boolean;
    // @Prop({ type: String, default: 'indexer.sick' }) public showMessage!: string;

}
</script>

