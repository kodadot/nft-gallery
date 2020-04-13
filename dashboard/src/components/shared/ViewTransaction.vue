<template>
  <a :href="getExplorerUrl(this.tx)">
    <b-button type="is-text">View Transaction {{ tx }}</b-button>
  </a>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { urlBuilderTransaction } from '@/utils/explorerGuide';

export default class ViewTransaction extends Vue {
	@Prop({ default: '' }) public tx: string = '';

  getExplorerUrl(value: string) {
    return urlBuilderTransaction(value, 
      this.$store.state.explorer.chain, 
      this.$store.state.explorer.provider)
  }

}
</script>
