<template>
  <!-- // TODO denomination and set asset by network -->
	<b-tag class="balance-tag" 
		type="is-dark" size="is-medium">
		Transferable: 
    <span v-if='balance !== null'>
      {{ balance }}
    </span> 
    <span v-else> - </span>
	</b-tag>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Connector from '@vue-polkadot/vue-api';
import formatBalance from '../../utils/formatBalance';

@Component({})
export default class Balance extends Vue {
  @Prop() public account!: string;

  private currentBalance: string = '';
  private chainProperties: any;
  private tokenSymbol: any = Object.entries(this.$store.state.chainProperties)[3][1]

  get balance() {
    return formatBalance(this.currentBalance, this.tokenSymbol, false);
  }

  get ChainProperties() {
    return this.chainProperties;
  }

  @Watch('account')
  public async onAccountChange(value: string) {
    const { api } = Connector.getInstance();
    const { nonce, data: balance } = await api.query.system.account(value);
    this.currentBalance = balance.free.toString();
  }

  private async setChainProperties(): Promise<void> {
    const { api } = Connector.getInstance();
    this.chainProperties = await api.registry.getChainProperties();
    this.$store.commit('setChainProperties', this.chainProperties)
    this.tokenSymbol = Object.entries(this.$store.state.chainProperties)[3][1];
  }

  private async mounted(): Promise<void> {
    this.setChainProperties()
  }
}
</script>

<style scoped>
  .balance-tag {
    margin-bottom: 0.5em;
  }
</style>
