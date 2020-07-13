<template>
  <div class="Accounts">
    <b-field grouped multiline>
      <router-link to="/accounts/create">
        <b-button type="is-dark" icon-left="plus" outlined>Add Account</b-button>
      </router-link>
      <router-link to="/accounts/restore">
        <b-button type="is-dark" icon-left="sync" outlined>Restore JSON</b-button>
      </router-link>
    </b-field>
    <b-field label="filter by name or tags">
      <b-input v-model="searchFilter" icon="search"
        placeholder="search..." @input="filterByName(searchFilter)">
      </b-input>
    </b-field>
    <ul>
      <li 
        v-for="acc in keyringAccounts"
        v-bind:key="acc.address"
      > 
        <Keypair 
          v-if="
          acc.visible 
          && !acc.meta.isExternal 
          && hideTestingAccounts == !acc.meta.isTesting"

          mode="accounts"
          :address="acc.address"
          :theme="theme"
          :meta="acc.meta"
          :publicKey="vueU8aToHex(acc.publicKey)"
          :type="acc.type"
          @forget-account="mapAccounts"
          @save-name="mapAccounts"
          @save-tags="mapAccounts"
        />
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import keyring from '@polkadot/ui-keyring';
import Keypair from '../shared/Keypair.vue';
import { u8aToHex } from '@polkadot/util';
import Connector from '@vue-polkadot/vue-api';

@Component({
  components: {
    Keypair,
  },
})
export default class Accounts extends Vue {
  private chainProperties: any;

  public searchFilter: string = ''.toLowerCase();
  public theme: string = 'substrate';
  public hideTestingAccounts: boolean = true;
  public modal: object = {
    create: false, import: false, backup: false, changePass: false };
  public keyringAccounts: any = [
    { address: '', meta: { name: ''}, publicKey: '', type: '' },
  ];
  public keyringAccountsFilter: any = [
    { address: '', meta: { name: ''}, publicKey: '', type: '' },
  ];

  public vueU8aToHex(publicKey: Uint8Array): string {
    return u8aToHex(publicKey);
  }

  public filterByName(searchFilter: string): void {
    for (const acc of this.keyringAccounts) {
      if (searchFilter.length === 0) {
        acc.visible = true;
      }
      
      if (acc.meta.name.toLowerCase().includes(searchFilter)
        || acc.meta.tags && acc.meta.tags.reduce((result: boolean, tag: string): boolean => {
          return result || tag.toLowerCase().includes(searchFilter); }) ) {
        acc.visible = true;
      } else {
        acc.visible = false;
      }
    }
  }

  @Watch('$store.state.keyringLoaded')
  public mapAccounts(): void {
    if (this.isKeyringLoaded()) {
      this.keyringAccounts = keyring.getPairs();
      // this.keyringAccountsFilter = keyring.getPairs();
    }
  }

  public isKeyringLoaded() {
    return this.$store.state.keyringLoaded;
  }

  public getIconTheme() {
    this.theme = this.$store.state.setting.icon;
  }

  public async mounted(): Promise<void> {
    this.isKeyringLoaded();
    this.mapAccounts();
    this.getIconTheme();
    this.filterByName(this.searchFilter);
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
