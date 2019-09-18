<template>
  <div class="Accounts">
    <button @click="loadKeyring()">Load testing accounts</button>
    <button @click="mapAccounts()">Map Accounts</button>
    <AccountKeypair
      :address="tmpAcc.alice"
      meta="aliceX"
      theme="polkadot"
    />
    <AccountKeypair
      :address="tmpAcc.bob"
      theme="substrate"
    />
    <AccountKeypair
      :address="tmpAcc.charlie"
      theme="beachball"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Identicon from '@vue-polkadot/vue-identicon';
import AccountKeypair from './AccountKeypair.vue';
import { waitReady } from '@polkadot/wasm-crypto';

import keyring from '@vue-polkadot/vue-keyring';

@Component({
  components: {
    Identicon,
    AccountKeypair,
  },
})
export default class Accounts extends Vue {
  public tmpAcc: object = {
    alice: 'SXYSytZ7wxpQHbRo5FzUFA9wjTfWvTQgYzhVEybWRQvBrvMS',
    bob: 'SVyHhpNypEpW8awHeL2XVpEydcedTv1M4AZABcTqMRzx61Ja',
    charlie: 'SW1wmzX29Ei8mCLxB7crVUhGTkL1TDtCUwpVickwdqBUNunM',
   };

  public keyringAccounts: object = [
    { address: '', meta: { name: 'x_x'}, publicKey: '', type: 'x_x' },
  ];

  public keys: any = '';
  public loadKeyring(): void {
    keyring.loadAll({
      ss58Format: 42, type: 'sr25519',
      isDevelopment: true });
    // console.log(keyring.getPairs());
    this.keys = keyring;
  }
  public mapAccounts(): void {
    this.keyringAccounts = keyring.getPairs();
  }

  public async mountWasmCrypto(): Promise<void> {
    await waitReady();
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
