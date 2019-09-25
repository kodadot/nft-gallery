<template>
  <div id="transfer">
    <b-field group multiline>
      <Identicon
        :value="transfer.from"
        :size="64" />
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
        :size="64" />
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

@Component({
  components: {
    Identicon,
  },
})
export default class Transfer extends Vue {
  public transfer: any = {
    from: '',
    to: '',
    amount: '',
  };
  public unitsSelected: any = 1;
  public units: any = [
    {name: 'femto', value: 1e-15},
    {name: 'pico', value: 1e-12},
    {name: 'nano', value: 1e-9},
    {name: 'micro', value: 1e-6},
    {name: 'mili', value: 1e-3},
    {name: 'DOT', value: 1},
    {name: 'Kilo', value: 1e3},
    {name: 'Mega', value: 1e6},
    {name: 'Giga', value: 1e9},
    {name: 'Tera', value: 1e12},
    {name: 'Peta', value: 1e15},
    {name: 'Exa', value: 1e18},
    {name: 'Zeta', value: 1e21},
    {name: 'Yotta', value: 1e24},
  ];
  public keyringAccounts: any = [];

  @Watch('$store.state.keyringLoaded')
  public mapAccounts(): void {
    if (this.isKeyringLoaded()) {
      this.keyringAccounts = keyring.getPairs();
    }
  }

  public isKeyringLoaded() {
    return this.$store.state.keyringLoaded;
  }

  public mounted(): void {
    this.isKeyringLoaded();
    this.mapAccounts();
  }
}
</script>