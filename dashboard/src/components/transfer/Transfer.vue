<template>
  <div id="transfer">
    <DisabledInput v-if="conn.chainName" 
      label="Chain" :value="conn.chainName" />
    <DisabledInput v-if="conn.blockNumber"
      label="Best Block" :value="conn.blockNumber" />
		<b-field v-else>
			<p class="has-text-danger">You are not connected. 
				<router-link :to="{ name: 'settings' }">
				Go to settings and pick node</router-link>
			</p>
		</b-field>
    <Dropdown mode='accounts' :externalAddress="transfer.from"
			@selected="handleAccountSelectionFrom" />
		<Dropdown :externalAddress="transfer.to"
			@selected="handleAccountSelectionTo" />
    <Balance :argument="{ name: 'balance', type: 'balance' }" @selected="handleValue"  />
    <b-field label="password 🤫 magic spell" class="password-wrapper">
      <b-input v-model="password" type="password" password-reveal>
      </b-input>
    </b-field>
      <div class="transaction buttons">
      <b-button
        type="is-primary"
        icon-left="paper-plane"
        outlined
        :disabled="!accountFrom || !password"
        @click="shipIt">
				Make Transfer
      </b-button>
      <b-button v-if="tx" tag="a" target="_blank" :href="getExplorerUrl(tx)" 
        icon-left="external-link-alt">
        View {{ tx.slice(0, 10) }}
      </b-button>
    </div>
  </div>  
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Identicon from '@polkadot/vue-identicon';
import keyring from '@polkadot/ui-keyring';
import Selection from '@/components/extrinsics/Selection.vue';
import Balance from '@/params/components/Balance.vue';
import Account from '@/params/components/Account.vue';
import { KeyringPair } from '@polkadot/keyring/types';
import Dropdown from '@/components/shared/Dropdown.vue';
import DisabledInput from '@/components/shared/DisabledInput.vue';
import Connector from '@vue-polkadot/vue-api';
import { urlBuilderTransaction } from '@/utils/explorerGuide';
import shortAddress from '@/utils/shortAddress';

@Component({
  components: {
    Identicon,
    Selection,
    Balance,
    Account,
    Dropdown,
    DisabledInput,
  },
})
export default class Transfer extends Vue {
  public theme: string = 'substrate';
  public tx: string = '';
  public password: string = '';
  public transfer: any = {
    from: null,
    fromBalance: null,
    to: null,
    toBalance: null,
    amountVisible: null,
    amount: null };
  public keyringAccounts: any = [];
  public conn: any = { blockNumber: '', chainName: ''};
  private balance = 0;
  private accountFrom: any = null;
  private accountTo: any = null;

  private snackbarTypes = {
    success: {
      type: 'is-success',
      actionText: 'View',
      onAction: () => window.open(this.getExplorerUrl(this.tx), '_blank'),
    },
    info: {
      type: 'is-info',
      actionText: 'OK',
    },
    danger: {
      type: 'is-danger',
      actionText: 'Oh no!',
    },
  };

  getExplorerUrl(value: string) {
    return urlBuilderTransaction(value, 
      this.$store.state.explorer.chain, 
      this.$store.state.explorer.provider)
  }

  public async shipIt(): Promise<void> {
    const { api } = Connector.getInstance();
      try {
        this.showNotification('Dispatched');
        const alicePair = keyring.getPair(this.accountFrom.address);
        alicePair.decodePkcs8(this.password);
        const txHash = await api.tx.balances.transfer(this.accountTo.address, this.balance).signAndSend(alicePair)
        this.showNotification(txHash.toHex(), this.snackbarTypes.success);
        
        this.tx = txHash.toHex();
      } catch (e) {
        this.showNotification(e, this.snackbarTypes.danger);
      }
  }

  @Watch('$store.state.keyringLoaded')
  public mapAccounts(): void {
    if (this.isKeyringLoaded() === true) {
      this.keyringAccounts = keyring.getPairs();
    }
  }

  public isKeyringLoaded() {
    return this.$store.state.keyringLoaded;
  }

  public getIconTheme() {
    this.theme = this.$store.state.setting.icon;
  }

  public async loadExternalInfo() {
    if ((this as any).$http.api) {
      const apiBestNumber = await (this as any).$http.api.derive.chain.bestNumber();
      this.conn.blockNumber = await apiBestNumber.toString();
      const apiResponse = await (this as any).$http.api.rpc.system.chain();
      this.conn.chainName = await apiResponse.toString();
    }
  }

  public handleAccountSelectionFrom(account: KeyringPair) {
    this.accountFrom = account;
  }

  public handleAccountSelectionTo(account: KeyringPair) {
    this.accountTo = account;
  }

  public handleValue(value: any) {
    Object.keys(value).map((item) => {
      (this as any)[item] = value[item];
    });
  }

  public externalURI() {
    if (this.$route.params.from) {
      this.transfer.from = this.$route.params.from;
    }
    if (this.$route.params.to) {
      this.transfer.to = this.$route.params.to;
    }
  }

  public mounted(): void {
    this.mapAccounts();
    this.getIconTheme();
    this.loadExternalInfo();
    this.externalURI();
  }

  private showNotification(message: string | null, params = this.snackbarTypes.info) {
    this.$buefy.snackbar.open({
      duration: 9000,
      message: `${shortAddress(this.accountFrom.address)} -> ${shortAddress(this.accountTo.address)}<br>${message}`,
      type: 'is-success',
      position: 'is-top-right',
      actionText: 'OK',
      queue: false,
      ...params,
    });
  }
}
</script>

<style scoped>
.transaction.buttons {
  margin-top: 1em;
  float: right;
}

.password-wrapper {
  margin-top: 1em;
}
</style>
