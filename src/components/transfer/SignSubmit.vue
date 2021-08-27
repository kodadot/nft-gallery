<template>
  <div id="transfer">
    <b-field v-if="conn.blockNumber">
      Recent block #{{conn.blockNumber}}
    </b-field>
		<b-field v-else>
			<p class="has-text-danger">You are not connected,
				<router-link :to="{ name: 'settings' }">
				go to settings and pick node</router-link>
			</p>
		</b-field>
    <Dropdown mode='accounts'
			@selected="handleAccountSelection" />
    <!-- <Selection mode='accounts' @selected="handleAccountSelection" /> -->
		<Dropdown
			@selected="handleAccountSelection" />
    <!-- <Selection @selected="handleAccountSelection" /> -->
    <!-- <Account :argument="{ name: 'to', type: 'account' }" @selected="handleValue" /> -->
    <Balance :argument="{ name: 'balance', type: 'balance' }" @selected="handleValue"  />
    <b-field label="password 🤫 magic spell" class="password-wrapper">
      <b-input v-model="password" type="password" password-reveal>
      </b-input>
    </b-field>
      <div class="transaction buttons">
      <!-- <b-button type="is-danger" outlined disabled>Submit unsigned</b-button> -->
      <b-button
        type="is-primary"
        icon-left="paper-plane"
        outlined
        :disabled="!account || !password"
        @click="shipIt">
				Make Transfer
      </b-button>
      <b-button v-if="tx" tag="a" :href="getExplorerUrl(tx)">
        View {{ tx.slice(0, 20) }}
      </b-button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Identicon from '@polkadot/vue-identicon';
import keyring from '@polkadot/ui-keyring'
import Selection from '@/components/extrinsics/Selection.vue';
import Balance from '@/params/components/Balance.vue';
import Account from '@/params/components/Account.vue';
import { KeyringPair } from '@polkadot/keyring/types';
import Dropdown from '@/components/shared/Dropdown.vue';
import { urlBuilderTransaction } from '@/utils/explorerGuide';

@Component({
  components: {
    Identicon,
    Selection,
    Balance,
    Account,
    Dropdown,
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
  public conn: any = { blockNumber: '', chain: '', nodeName: '', nodeVersion: '', header: {}};
  private to = '';
  private balance = 0;
  private account: any = null;

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

  @Watch('transfer.from')
  @Watch('transfer.to')
  public async fetchAmount(): Promise<void> {
    if ((this as any).$http.api) {
      if (this.transfer.from) {
        const fromBalance = await (this as any).$http.api.query.balances.freeBalance(this.transfer.from);
        this.transfer.fromBalance = await fromBalance.toString();
      }
      if (this.transfer.to) {
        const toBalance = await (this as any).$http.api.query.balances.freeBalance(this.transfer.to);
        this.transfer.toBalance = await toBalance.toString();
      }
    }
  }

  public async shipIt(): Promise<void> {
    if ((this as any).$http.api) {
      const apiResponse = await (this as any).$http.api.rpc.system.chain();
      this.conn.chainName = await apiResponse.toString();
      try {
        this.showNotification('Dispatched');
        const transfer =
        await (this as any).$http.api.tx.balances.transfer(this.to,
          this.balance);
        const nonce =
        await (this as any).$http.api.query.system.accountNonce(this.account.address);
        const alicePair = keyring.getPair(this.account.address);
        alicePair.decodePkcs8(this.password);
        console.log(await nonce.toString());
        const hash = await transfer.signAndSend(alicePair);
        this.showNotification(hash.toHex(), this.snackbarTypes.success);
        console.log('tx', hash.toHex());
        this.tx = hash.toHex();
      } catch (e) {
        this.showNotification(e, this.snackbarTypes.danger);
      }
    }
  }

  @Watch('$store.state.keyringLoaded')
  public mapAccounts(): void {
    // console.log(this.$store.state.keyringLoaded);
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
      // const apiVersion = await (this as any).$http.api.consts.balances;
      // console.log(await apiVersion);
    }
  }

  public handleAccountSelection(account: KeyringPair) {
    this.account = account;
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
      duration: 5000,
      message: `${this.account.address} -> ${this.to}<br>${message}`,
      position: 'is-top-right',
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
