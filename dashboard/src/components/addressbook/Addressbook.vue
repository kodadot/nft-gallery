<template>
  <div id="addressbook">
    <p>My contacts</p>
    <b-field grouped multiline>
      <router-link to="addressbook/create">
        <b-button type="is-dark" icon-left="plus" outlined>Add Account</b-button>
      </router-link>
    </b-field>
    <b-field label="filter by name or tags">
      <b-input v-model="searchInput" icon="search"
        placeholder="search..." @input="filterByName(searchInput)">
      </b-input>
    </b-field>
    <ul>
      <li
        v-for="acc in keyringAccounts"
        v-bind:key="acc.address"
      > 
      <Keypair v-if="isKeyringLoaded && acc.meta.isExternal && acc.visible"
        mode="addressbook"
        :address="acc.address"
        :theme="theme"
        :meta="acc.meta"
        @forget-account="mapAccounts"
        @save-name="mapAccounts"
        @save-tags="mapAccounts" 
      />
      </li>
    </ul>
  </div>  
</template>
<script lang="ts">
import { Component, Prop, Vue, PropSync, Watch } from 'vue-property-decorator';
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
  public searchInput: string = ''.toLowerCase();
  public newName: string = '';
  public keyringAccounts: any = [];
  public theme: string = 'substrate';

  public filterByName(filter: string): void {
    for (const acc of this.keyringAccounts) {
      if (filter.length === 0) {
        acc.visible = true;
      }
      if (acc.meta.name.toLowerCase().includes(filter)
        || acc.meta.tags && acc.meta.tags.reduce((result: boolean, tag: string): boolean => {
          return result || tag.toLowerCase().includes(filter); }) ) {
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
    this.filterByName(this.searchInput);
  }

}
</script>