<template>
  <div class="Accounts">
    <button @click="loadKeyring()">Load Testing Accounts</button>
    <select v-model="theme">
      <option selected>polkadot</option>
      <option>substrate</option>
      <option>beachball</option>
    </select>
    <div>
      Password <input v-model="password">
    </div>
    <div>Restore 
      <Restore 
        :password="password" />
    </div>
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
        <button @click="forgetAccount(acc.address)">Forget</button>
        <Backup 
          :address="acc.address"
          :password="password" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import keyring from '@vue-polkadot/vue-keyring';
import AccountKeypair from './accounts/AccountKeypair.vue';
import Backup from './accounts/Backup.vue';
import Restore from './accounts/Restore.vue';
import { waitReady } from '@polkadot/wasm-crypto';
import { u8aToHex } from '@polkadot/util';

@Component({
  components: {
    AccountKeypair,
    Backup,
    Restore,
  },
})
export default class Accounts extends Vue {
  public keys: any = '';
  public theme: string = 'polkadot';
  public password: string = '0000';
  public keyringAccounts: any = [
    { address: '', meta: { name: ''}, publicKey: '', type: '' },
  ];

  public vueU8aToHex(publicKey: Uint8Array): string {
    return u8aToHex(publicKey);
  }

  public forgetAccount(address: string): void {
    keyring.forgetAccount(address);
    this.keyringAccounts = keyring.getPairs();
  }

  public loadKeyring(): void {
    keyring.loadAll({
      ss58Format: 42, type: 'sr25519',
      isDevelopment: true });

    this.keys = keyring;
    this.mapAccounts();
  }
  public mapAccounts(): void {
    this.keyringAccounts = keyring.getPairs();
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
