<template>
  <div id="transfer">
    <b-field group multiline>
      Recent block {{conn.header.number}}
    </b-field>
    <TxPicker
      label="send from account"
      :address.sync="transfer.from"
      :theme="theme"
      :keyringAccounts="keyringAccounts"
      :balance="transfer.fromBalance"
    />
    <TxPicker
      label="send to address"
      :address.sync="transfer.to"
      :theme="theme"
      :keyringAccounts="keyringAccounts"
      :balance="transfer.toBalance"
    />
    <b-button @click="fetchAmount">fetchAmount</b-button>
    <b-field label="amount">
      <b-input v-model="transfer.amount"
      type="number">
      </b-input>
      <p class="control">
        <b-select v-model="unitsSelected">
          <option v-for="u in units"
            v-bind:key="u.name"
            v-bind:value="u.value">
            {{u.name}}
          </option>
        </b-select>
      </p>
    </b-field>
    <b-button icon-left="paper-plane">Make Transfer
    </b-button>
  </div>  
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Identicon from '@vue-polkadot/vue-identicon';
import keyring from '@vue-polkadot/vue-keyring';
import TxPicker from './TxPicker.vue';
// import { SubmittableExtrinsic, QueryableStorageEntry } from '@polkadot/api/promise/types';
import { ApiPromise, WsProvider } from '@polkadot/api';

@Component({
  components: {
    Identicon,
    TxPicker,
  },
})
export default class Transfer extends Vue {
  public theme: string = 'substrate';
  public transfer: any = {
    from: '5FWhigNPRJAdvvdJWZKcFsAHV9jm4K6bZs84TAQ3eVmqf8Hj',
    to: '', amount: '', fromBalance: '',
    toBalance: '' };
  public unitsSelected: any = 1;
  public units: any = [
    {name: 'femto', value: 1e-15}, {name: 'pico', value: 1e-12},
    {name: 'nano', value: 1e-9}, {name: 'micro', value: 1e-6},
    {name: 'mili', value: 1e-3}, {name: 'DOT', value: 1},
    {name: 'Kilo', value: 1e3}, {name: 'Mega', value: 1e6},
    {name: 'Giga', value: 1e9}, {name: 'Tera', value: 1e12},
    {name: 'Peta', value: 1e15}, {name: 'Exa', value: 1e18},
    {name: 'Zeta', value: 1e21}, {name: 'Yotta', value: 1e24},
  ];
  public keyringAccounts: any = [];
  public conn: any = { chain: '', nodeName: '', nodeVersion: '', header: {}};
  public api: any = '';
  public async apiInit(): Promise<void> {
    const wsprovider = new WsProvider('wss://poc3-rpc.polkadot.io/');
    this.api = await ApiPromise.create({provider: wsprovider});

    this.api.rpc.chain.subscribeNewHeads((header: any) => {
      this.conn.header = header;
    });

    console.log(this.api.genesisHash.toHex());
    // console.log(await this.api.rpc.system.chain());
    this.transfer.fromBalance = await this.api.query.balances.freeBalance(this.transfer.from);
    // this.transfer.fromBalance = await this.api.query.balances.freeBalance(this.transfer.from);
    // [this.conn.chain, this.conn.nodeName, this.conn.nodeVersion] = await Promise.all([
    //   this.api.rpc.system.chain(),
    //   this.api.rpc.system.name(),
    //   this.api.rpc.system.version(),
    // ]);

    // this.api.combineLatest([
    //   this.api.rpc.chain.subscribeNewHeads,
    //   [this.api.query.balances.freeBalance, this.transfer.from],
    //   (cb) => this.api.query.system.accountNonce(this.transfer.from, cb),
    // ], ([head, balance, nonce]) => {
    //   console.log(`#${head.number}: You have ${balance} units, with ${nonce} transactions sent`);
    // });

    // console.log(this.conn);
  }

  public async fetchAmount(): Promise<void> {
    console.log('fetchAmount');
    if ((this as any).$http.api) {
      const fromBalance = await (this as any).$http.api.query.balances.freeBalance(this.transfer.from);
      this.transfer.fromBalance = await fromBalance;
      const toBalance = await (this as any).$http.api.query.balances.freeBalance(this.transfer.to);
      this.transfer.toBalance = await toBalance;
    }

  }

  @Watch('$store.state.keyringLoaded')
  public mapAccounts(): void {
    // console.log(this.$store.state.keyringLoaded);
    if (this.isKeyringLoaded()) {
      this.keyringAccounts = keyring.getPairs();
    }
  }

  public isKeyringLoaded() {
    return this.$store.state.keyringLoaded;
  }

  public getIconTheme() {
    this.theme = this.$store.state.setting.icon;
  }

  public mounted(): void {
    this.isKeyringLoaded();
    this.mapAccounts();
    this.getIconTheme();
    // this.apiInit();
  }
}
</script>