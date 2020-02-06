<template>
  <div id="addressbook">
    <p>My contacts
      <b-tag>5DFwZivYX7hEjBsVH7KGYZYCJMtb75t2aBoeJnzLSLZGPLFn</b-tag>
    </p>
    <b-field grouped multiline>
      <router-link to="addressbook/create">
        <b-button type="is-dark" icon-left="plus" outlined>Add Account</b-button>
      </router-link>
    </b-field>
    <ul>
      <li
        v-for="acc in keyringAccounts"
        v-bind:key="acc.address"
      > 
      <Keypair v-if="isKeyringLoaded && acc.meta.isExternal"
        mode="addressbook"
        :address="acc.address"
        :theme="theme"
        :meta="acc.meta"
        @forget-account="mapAccounts" />
      </li>
    </ul>
  </div>  
</template>
<script lang="ts">
import { Component, Prop, Vue, PropSync, Watch } from 'vue-property-decorator';
import { waitReady } from '@polkadot/wasm-crypto';
import Identicon from '@vue-polkadot/vue-identicon';
import keyring from '@vue-polkadot/vue-keyring';
import Keypair from '../shared/Keypair.vue';
import { mapState } from 'vuex';

@Component({
  components: {
    Identicon,
    Keypair,
  },
})

export default class AddressBook extends Vue {
  public keyringAccounts: any = [];
  public theme: string = 'substrate';

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