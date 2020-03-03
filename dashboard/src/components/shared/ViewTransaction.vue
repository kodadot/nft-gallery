<template>
  <a :href="explorer + tx">
    <b-button type="is-text">View Transaction on PolkaScan {{ tx }}</b-button>
  </a>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

export default class ViewTransaction extends Vue {
	@Prop({ default: '' }) public tx: string = '';

	private explorer: string = 'https://polkascan.io/pre/kusama/transaction/';


}
</script>
