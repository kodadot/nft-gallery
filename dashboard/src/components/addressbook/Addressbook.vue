<template>
  <div id="addressbook">
    <p>My contacts</p>
    <b-tag>5CPjD48eo47mRR5J1MvahXsaTAD1x2m7fGNmsvVb1ynrT2z3</b-tag>
    <b-tag>5CigBWKMkumrHoJ6CHComH43LAWBh192sXZpm4Xrzqe9umz1</b-tag>
    <Create 
      v-if="isKeyringLoaded"
      :theme="theme"
      @on-create="mapAccounts" />
    <ul>
      <li
        v-for="acc in keyringAccounts"
        v-bind:key="acc.address"
      > 
      <Keypair v-if="isKeyringLoaded && acc.meta.isExternal"
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
import Keypair from './Keypair.vue';
import Create from './Create.vue';
import { mapState } from 'vuex';

@Component({
  components: {
    Identicon,
    Keypair,
    Create,
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