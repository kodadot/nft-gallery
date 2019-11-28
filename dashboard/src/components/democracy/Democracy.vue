<template>
  <div id="transfer">
    <b-tabs>
      <b-tab-item label="Democracy"></b-tab-item>
    </b-tabs>
    <b-field>Recent block #{{conn.blockNumber}}</b-field>
    <Selection @selected="handleAccountSelection" />
    <Executor :methods="methods" @selected="handleMethodSelection" />
    <Argurments :args="args" @selected="handleSelectedArguments" />
    <b-field label="put magic spell here - password">
      <b-input v-model="password" type="password" password-reveal></b-input>
    </b-field>
    <b-button type="is-primary" icon-left="paper-plane" @click="shipIt">Make Transfer</b-button>
    <br />
    <a :href="explorer+tx">
      <b-button>View on PolkaScan 👀 {{tx.slice(0,20)}}</b-button>
    </a> 
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Identicon from '@vue-polkadot/vue-identicon';
import keyring from '@vue-polkadot/vue-keyring';
import TxSelect from '../transfer/TxSelect.vue';
import Executor from '@/components/extrinsics/Executor.vue';
import Argurments from '@/components/extrinsics/Arguments.vue';
import Selection from '@/components/extrinsics/Selection.vue';


@Component({
  components: {
    Identicon,
    TxSelect,
    Executor,
    Argurments,
    Selection
  },
})
export default class Democracy extends Vue {

  get methods() {
    return Object.keys((this as any).$http.api.tx.democracy);
  }
  public theme: string = 'substrate';
  public tx: string = '';
  public explorer: string = 'https://polkascan.io/pre/alexander/transaction/';
  public password: string = '';
  public transfer: any = {
    from: null,
    fromBalance: null,
    to: null,
    toBalance: null,
    amountVisible: null,
    amount: null,
  };
  public unitsSelected: any = 1e-3;
  public units: any = [
    { name: 'femto', value: 1e-15 },
    { name: 'pico', value: 1e-12 },
    { name: 'nano', value: 1e-9 },
    { name: 'micro', value: 1e-6 },
    { name: 'mili', value: 1e-3 },
    { name: 'DOT', value: 1 },
    { name: 'Kilo', value: 1e3 },
    { name: 'Mega', value: 1e6 },
    { name: 'Giga', value: 1e9 },
    { name: 'Tera', value: 1e12 },
    { name: 'Peta', value: 1e15 },
    { name: 'Exa', value: 1e18 },
    { name: 'Zeta', value: 1e21 },
    { name: 'Yotta', value: 1e24 },
  ];
  public keyringAccounts: any = [];
  public conn: any = {
    blockNumber: '',
    chain: '',
    nodeName: '',
    nodeVersion: '',
    header: {},
  };
  private account: any = null;
  public fnMethod = '';
  private args: any[] = [];
  private selectedArguments = {};

  @Watch('transfer.from')
  @Watch('transfer.to')
  public async fetchAmount(): Promise<void> {
    if ((this as any).$http.api) {
      if (this.transfer.from) {
        const fromBalance = await (this as any).$http.api.query.balances.freeBalance(
          this.transfer.from,
        );
        this.transfer.fromBalance = await fromBalance.toString();
      }
    }
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
      const transfer = await (this as any).$http.api.tx.democracy[this.fnMethod](
        ...args,
      );
      const nonce = await (this as any).$http.api.query.system.accountNonce(
        this.transfer.from,
      );
      const alicePair = keyring.getPair(this.transfer.from);
      alicePair.decodePkcs8(this.password);
      console.log(await nonce.toString());
      const hash = await transfer.signAndSend(alicePair);
      console.log('tx', hash.toHex());
      this.tx = hash.toHex();
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

  private argMapper(arg: any): any {
    const accessor: string = arg.name.toString();
    // @ts-ignore: Method has always value
    return this.selectedArguments[accessor];
  }
}
</script>