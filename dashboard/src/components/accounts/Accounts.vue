<template>
  <div class="Accounts">
    <b-field grouped group-multiline>
      <b-select v-model="theme">
        <option selected>substrate</option>
        <option>polkadot</option>
        <option>beachball</option>
      </b-select>
      <!-- <b-switch v-model="hideTestingAccounts"
        :outlined="switchStyle.isOutlined"
        :rounded="switchStyle.isRounded"
        :size="switchStyle.size"> Hide Testing Acc
      </b-switch> -->
    </b-field>
    <p>My accounts</p>
    <div> 
      <Restore 
        @on-restore="mapAccounts" />
    </div>
    <Create
      v-if="isKeyringLoaded"
      :theme="theme"
      @on-create="mapAccounts" />
    <ul>
      <li 
        v-for="acc in keyringAccounts"
        v-bind:key="acc.address"
      > 
        <Keypair v-if="!acc.meta.isExternal && hideTestingAccounts == !acc.meta.isTesting"
          :address="acc.address"
          :theme="theme"
          :meta="acc.meta"
          :publicKey="vueU8aToHex(acc.publicKey)"
          :type="acc.type"
          @forget-account="mapAccounts"
        />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import keyring from '@vue-polkadot/vue-keyring';
import Keypair from './Keypair.vue';
import Restore from './Restore.vue';
import Create from './Create.vue';
import { waitReady } from '@polkadot/wasm-crypto';
import { u8aToHex } from '@polkadot/util';

@Component({
  components: {
    Keypair,
    Create,
    Restore,
  },
})
export default class Accounts extends Vue {
  public keyringLoaded: boolean = false;
  public keys: any = '';
  public theme: string = 'substrate';
  public switchStyle: object = { isOutlined: true, isRounded: false, size: 'is-medium' };
  public hideTestingAccounts: boolean = true;
  public modal: object = {
    create: false, import: false, backup: false, changePass: false };
  public keyringAccounts: any = [
    { address: '', meta: { name: ''}, publicKey: '', type: '' },
  ];

  public vueU8aToHex(publicKey: Uint8Array): string {
    return u8aToHex(publicKey);
  }

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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
