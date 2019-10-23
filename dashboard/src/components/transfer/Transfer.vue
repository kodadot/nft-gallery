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
    <b-field label="amount">
      <b-input v-model="transfer.amountVisible"
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
    <b-button 
      type="is-primary" 
      icon-left="paper-plane"
      @click="shipIt">
      Make Transfer
    </b-button>
    <!-- <b-field label="put magic here">
      <b-input v-model="password" password-reveal>
      </b-input>
    </b-field> -->
    <br>last tx {{tx}}
  </div>  
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import Identicon from '@vue-polkadot/vue-identicon';
import keyring from '@vue-polkadot/vue-keyring';
import TxPicker from './TxPicker.vue';

@Component({
  components: {
    Identicon,
    TxPicker,
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
      const transfer =
        await (this as any).$http.api.tx.balances.transfer(this.transfer.to,
          this.transfer.amountVisible * this.unitsSelected);
      const nonce = await (this as any).$http.api.query.system.accountNonce(this.transfer.from);
      const alicePair = keyring.getPair(this.transfer.from);
      console.log(nonce);
      // console.log(alice.decodePkcs8(this.password));
      const hash = await transfer.signAndSend(alicePair);
      this.tx = hash.toHex();
      console.log('tx', hash.toHex());
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
  }
}
</script>