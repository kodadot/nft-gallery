<template>
  <div>
    <b-field>Recent block #{{conn.blockNumber}}</b-field>
    <Selection @selected="handleAccountSelection" />
       <Executor
        :methods="methods"
        @selected="handleMethodSelection"
        label="method"
      />
    <Argurments :args="args" @selected="handleSelectedArguments" />
      <b-field
      v-if="account"
      class="password-wrapper"
      label="put magic spell here - password"
    >
      <b-input v-model="password" type="password" password-reveal></b-input>
    </b-field>
    <div class="transaction buttons">
      <b-button
        type="is-primary"
        icon-left="paper-plane"
        :disabled="!account || !password"
        @click="shipIt"
      >
        Submit Transaction
      </b-button>
      <b-button v-if="tx" tag="a" :href="getExplorerUrl(tx)">
        View {{ tx.slice(0, 20) }}
      </b-button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Identicon from '@vue-polkadot/vue-identicon';
import keyring from '@polkadot/ui-keyring';
import TxSelect from '../transfer/TxSelect.vue';
import Executor from '@/components/extrinsics/Executor.vue';
import Argurments from '@/components/extrinsics/Arguments.vue';
import Selection from '@/components/extrinsics/Selection.vue';
import { urlBuilderTransaction } from '@/utils/explorerGuide';

@Component({
  components: {
    Selection,
    Executor,
    Argurments,
  },
})
export default class Democracy extends Vue {
  get methods() {
    return this.fnSection
      ? Object.keys((this as any).$http.api.tx[this.fnSection])
      : [];
  }
  private isValid: boolean = false;
  private isValidUnsigned: boolean = false;
  private method = null;
  // private apiDefaultTxSudo = apiDefaultTxSudo;
  // private methods =
  private fnSection = 'democracy';
  private fnMethod = '';
  private args: any[] = [];
  private selectedArguments = {};
  private account: any = null;
  private password: string = '';
  private tx: string = '';
  private conn: any = {
    blockNumber: '',
    chain: '',
    nodeName: '',
    nodeVersion: '',
    header: {},
  };
  private keyringAccounts: any = [];
  private theme: string = 'substrate';
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

  public handleAccountSelection(account: any) {
    console.log('account', account);

    this.account = account;
  }

  public async shipIt(): Promise<void> {
    if ((this as any).$http.api) {
      const apiResponse = await (this as any).$http.api.rpc.system.chain();
      this.conn.chainName = await apiResponse.toString();
      const args = this.args.map(this.argMapper);
      try {
        this.showNotification('Dispatched');
        const transfer = await (this as any).$http.api.tx[this.fnSection][this.fnMethod](
        ...args,
      );
        const nonce = await (this as any).$http.api.query.system.accountNonce(
        this.account.address,
      );
        const alicePair = keyring.getPair(this.account.address);
        alicePair.decodePkcs8(this.password);
        console.log(await nonce.toString());
        const hash = await transfer.signAndSend(alicePair, { nonce });
        this.showNotification(hash.toHex(), this.snackbarTypes.success);
        console.log('tx', hash.toHex());
        this.tx = hash.toHex();
      } catch (e) {
        this.showNotification(e, this.snackbarTypes.danger);
      }

    }
  }

  public isKeyringLoaded() {
    return this.$store.state.keyringLoaded;
  }

  public async loadExternalInfo() {
    if ((this as any).$http.api) {
      const apiBestNumber = await (this as any).$http.api.derive.chain.bestNumber();
      this.conn.blockNumber = await apiBestNumber.toString();
    }
  }

  public handleMethodSelection(value: string) {
    this.fnMethod = value;
    this.args = (this as any).$http.api.tx.democracy[value].meta.args;
  }

  public handleSelectedArguments(value: any) {
    this.selectedArguments = {
      ...this.selectedArguments,
      ...value,
    };
  }

  public mounted(): void {
    this.mapAccounts();
    this.getIconTheme();
    this.loadExternalInfo();
  }

  @Watch('$store.state.keyringLoaded')
  public mapAccounts(): void {
    if (this.isKeyringLoaded()) {
      this.keyringAccounts = keyring.getPairs();
    }
  }

  public getIconTheme() {
    this.theme = this.$store.state.setting.icon;
  }

    private showNotification(message: string | null, params = this.snackbarTypes.info) {
    this.$buefy.snackbar.open({
      duration: 15000,
      message: `${this.fnSection}:${this.fnMethod}<br>${message}`,
      type: 'is-success',
      position: 'is-top-right',
      actionText: 'OK',
      queue: false,
      ...params,
    });
  }

  private argMapper(arg: any): any {
    const accessor: string = arg.name.toString();
    // @ts-ignore: Method has always value
    return this.selectedArguments[accessor];
  }
}
</script>
