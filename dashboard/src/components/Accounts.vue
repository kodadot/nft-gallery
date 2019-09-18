<template>
  <div class="Accounts">
    <button @click="loadKeyring()">Load testing accounts</button>
    <button @click="mapAccounts()">Map Accounts</button>
    <select v-model="theme">
      <option selected>polkadot</option>
      <option>substrate</option>
      <option>beachball</option>
    </select>
    <ul>
      <li 
        v-for="acc in keyringAccounts"
        v-bind:key="acc.address"
      >
        <AccountKeypair
          :address="acc.address"
          :theme="theme"
          :meta="acc.meta"
          :publicKey="vueU8aToHex(acc.publicKey)"
          :type="acc.type"
        />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Identicon from '@vue-polkadot/vue-identicon';
import keyring from '@vue-polkadot/vue-keyring';
import AccountKeypair from './AccountKeypair.vue';
import { waitReady } from '@polkadot/wasm-crypto';
import { u8aToHex } from '@polkadot/util';

@Component({
  components: {
    Identicon,
    AccountKeypair,
  },
})
export default class Accounts extends Vue {
  public keys: any = '';
  public tmpAcc: object = {
    alice: 'SXYSytZ7wxpQHbRo5FzUFA9wjTfWvTQgYzhVEybWRQvBrvMS',
    bob: 'SVyHhpNypEpW8awHeL2XVpEydcedTv1M4AZABcTqMRzx61Ja',
    charlie: 'SW1wmzX29Ei8mCLxB7crVUhGTkL1TDtCUwpVickwdqBUNunM',
   };
  public theme: string = 'polkadot';
  public keyringAccounts: any = [
    { address: '', meta: { name: ''}, publicKey: '', type: '' },
  ];

  public vueU8aToHex(publicKey: Uint8Array): string {
    return u8aToHex(publicKey);
  }

  public loadKeyring(): void {
    keyring.loadAll({
      ss58Format: 42, type: 'sr25519',
      isDevelopment: true });
    // console.log(keyring.getPairs());
    this.keys = keyring;
  }
  public mapAccounts(): void {
    this.keyringAccounts = keyring.getPairs();
    // this.keyringAccounts = Object.keys(importAccounts).forEach(a.publicKey => u8aToHex(a.publicKey));
  }

  public async mountWasmCrypto(): Promise<void> {
    await waitReady();
    console.log('loaded');
    // console.log(keyring.encodeAddress('0x6674a2958bf589aca9056d57b26f758c50d5aa95aa36dcfbb8659a8bdf7eef6d'));
  }

  public mounted(): void {
    this.mountWasmCrypto();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
