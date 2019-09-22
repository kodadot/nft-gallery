<template>
  <div class="Accounts">
    <b-button type="is-primary" @click="loadKeyring()">
      <font-awesome-icon icon="play"/>
      Load Testing Accounts</b-button>
      <b-switch v-model="hideTestingAccounts"
        :outlined="switchStyle.isOutlined"
        :rounded="switchStyle.isRounded"
        :size="switchStyle.size"> Hide Testing Acc
      </b-switch>
    <b-select v-model="theme">
      <option selected>substrate</option>
      <option>polkadot</option>
      <option>beachball</option>
    </b-select>
    <div>
      <b-field label="password">
        <b-input type="password" v-model="password" 
          password-reveal></b-input>
      </b-field>
    </div>
    <div> 
      <Restore 
        :password="password"
        @refreshAccounts="mapAccounts" />
      <b-button type="is-light" @click="mapAccounts()">
        <font-awesome-icon icon="redo"/>
        Refresh Accounts</b-button>
    </div>
    <Create
      :theme="theme"
      @refreshAccounts="mapAccounts" />
    <ul>
      <li 
        v-for="acc in keyringAccounts"
        v-bind:key="acc.address"
      > 
        <AccountKeypair v-if="hideTestingAccounts == !acc.meta.isTesting"
          :address="acc.address"
          :theme="theme"
          :meta="acc.meta"
          :publicKey="vueU8aToHex(acc.publicKey)"
          :type="acc.type"
          @refreshAccounts="mapAccounts"
          :password="password"
        />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import keyring from '@vue-polkadot/vue-keyring';
import AccountKeypair from './accounts/AccountKeypair.vue';
import Restore from './accounts/Restore.vue';
import Create from './accounts/Create.vue';
import { waitReady } from '@polkadot/wasm-crypto';
import { u8aToHex } from '@polkadot/util';

@Component({
  components: {
    AccountKeypair,
    Create,
    Restore,
  },
})
export default class Accounts extends Vue {
  public keys: any = '';
  public theme: string = 'substrate';
  public password: string = 'password';
  public switchStyle: object = { isOutlined: true, isRounded: false, size: 'is-large' };
  public hideTestingAccounts: boolean = false;
  public keyringAccounts: any = [
    { address: '', meta: { name: ''}, publicKey: '', type: '' },
  ];

  public vueU8aToHex(publicKey: Uint8Array): string {
    return u8aToHex(publicKey);
  }

  public forgetAccount(address: string): void {
    keyring.forgetAccount(address);
    this.mapAccounts();
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
    console.log('wasmCrypto loaded');
  }

  public mounted(): void {
    this.mountWasmCrypto();

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
