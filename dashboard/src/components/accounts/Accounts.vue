<template>
  <div class="Accounts">
    <b-field grouped multiline>
      <router-link to="accounts/create">
        <b-button type="is-dark" icon-left="plus" outlined>Add Account</b-button>
      </router-link>
      <router-link to="accounts/restore">
        <b-button type="is-dark" icon-left="sync" outlined>Restore</b-button>
      </router-link>
    </b-field>
    <!-- will go to the modals -->
    <!-- <p>My accounts</p> -->
    <!-- <div> 
      <Restore @on-restore="mapAccounts" />
    </div> -->
    <!-- <div>
      <Create
        v-if="isKeyringLoaded"
        :theme="theme"
        @on-create="mapAccounts" />
    </div> -->
    <ul>
      <li 
        v-for="acc in keyringAccounts"
        v-bind:key="acc.address"
      > 
        <Keypair v-if="!acc.meta.isExternal && hideTestingAccounts == !acc.meta.isTesting"
          mode="accounts"
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
import Keypair from '../shared/Keypair.vue';
import Restore from '../shared/Restore.vue';
import Create from '../shared/Create.vue';
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
