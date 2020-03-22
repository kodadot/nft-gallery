<template>
  <!-- // TODO denomination and set asset by network -->
	<b-tag class="balance-tag" 
		type="is-dark" size="is-medium">
		Transferable: 
    <span v-if='balance !== null'>{{ balance }}</span> 
    <span v-else> - </span>
    <span v-if='chainProperties'>{{ chainProperties.tokenSymbol }}</span>
    <span v-else> - </span>
	</b-tag>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class Balance extends Vue {
  @Prop() public account!: string;

  private currentBalance = null;
  private chainProperties = null;

  get balance() {
    return this.currentBalance;
  }

  get ChainProperties() {
    return this.chainProperties;
  }

  @Watch('account')
  public async onAccountChange(value: string) {

    if (value && (this as any).$http) {
      const { api } = (this as any).$http;
      this.currentBalance = await api.query.balances.freeBalance(value);
    }
  }

  private async mounted(): Promise<void> {
    const { api } = (this as any).$http;
    this.chainProperties = await api.registry.getChainProperties();
  }
}
</script>

<style scoped>
  .balance-tag {
    margin-bottom: 0.5em;
  }
</style>
