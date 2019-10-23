<template>
  <div id="transfer">
    <b-field group multiline>
      Recent block {{conn.header.number}}
    </b-field>
    <TxPicker
      label="send from account"
      :address="transfer.from"
      :theme="theme"
      :keyringAccounts="keyringAccounts"
      :balance="transfer.fromBalance"
    />
    <TxPicker
      label="send to address"
      :address="transfer.to"
      :theme="theme"
      :keyringAccounts="keyringAccounts"
      :balance="transfer.toBalance"
    />
    <b-field group multiline>
      <Identicon 
        :value="transfer.from"
        :theme="theme"
        :size="64" />
      Available Amount {{transfer.fromBalance}}
      <b-field label="send from account">
        <b-select v-model="transfer.from">
          <optgroup v-for="acc in keyringAccounts"
            v-bind:key="acc.name"
            v-bind:value="acc.address"
            :label="acc.address.slice(0,20)">
            <option :value="acc.address">
              {{acc.meta.name}}
            </option>
          </optgroup>
        </b-select>
      </b-field>
    </b-field>
    <b-field group multiline>
      <Identicon
        :value="transfer.to"
        :theme="theme"
        :size="64" />
      <b-button @click="fetchAmount">fetchAmount</b-button>
      <b-field label="send to address">
        <b-select v-model="transfer.to">
          <optgroup v-for="acc in keyringAccounts"
            v-bind:key="acc.name"
            v-bind:value="acc.address"
            :label="acc.address.slice(0,20)">
            <option :value="acc.address">
              {{acc.meta.name}}
            </option>
          </optgroup>
        </b-select>
      </b-field>
    </b-field>
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
  public wsProviders: object = [
    {name: 'poc3-rpc.polkadot', value: 'wss://poc3-rpc.polkadot.io/'},
    {name: 'alex.unfrastructure', value: 'wss://alex.unfrastructure.io/public/ws'},
    {name: 'localhost:9444', value: 'ws://127.0.0.1:9944'}];
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
    this.transfer.fromBalance = await this.api.query.balances.freeBalance(this.transfer.from);
    this.transfer.toBalance = await this.api.query.balances.freeBalance(this.transfer.to);
  }

  // @Watch('$store.state.keyringLoaded')
  public mapAccounts(): void {
    console.log(this.$store.state.keyringLoaded);
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
    this.apiInit();
  }
}
</script>