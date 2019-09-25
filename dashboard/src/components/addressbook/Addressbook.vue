<template>
  <div id="addressbook">
    <p>Address book soon 🌱</p>
    <p>5CPjD48eo47mRR5J1MvahXsaTAD1x2m7fGNmsvVb1ynrT2z3</p>
    <p>5CigBWKMkumrHoJ6CHComH43LAWBh192sXZpm4Xrzqe9umz1</p>
    <Create v-if="keyringLoaded"
      @on-create="mapAccounts" />
    <ul>
      <li
        v-for="acc in keyringAccounts"
        v-bind:key="acc.address"
      > 
      <Keypair v-if="keyringLoaded && acc.meta.isExternal"
        :address="acc.address"
        :meta="acc.meta"
        @forget-account="mapAccounts" />
      </li>
    </ul>
    
  </div>  
</template>
<script lang="ts">
import { Component, Prop, Vue, PropSync } from 'vue-property-decorator';
import { waitReady } from '@polkadot/wasm-crypto';
import Identicon from '@vue-polkadot/vue-identicon';
import keyring from '@vue-polkadot/vue-keyring';
import Keypair from './Keypair.vue';
import Create from './Create.vue';

@Component({
  components: {
    Identicon,
    Keypair,
    Create,
  },
})
export default class AddressBook extends Vue {
  public keyringAccounts: any = [];
  public keyringLoaded: boolean = false;
  public keys: any = '';

  public mapAccounts(): void {
    if (this.keyringLoaded) {
      this.keyringAccounts = keyring.getPairs();
    }
  }

  public isKeyringLoaded() {
    return this.keyringLoaded = this.$store.state.keyringLoaded;
  }

  public mounted(): void {
    this.isKeyringLoaded();
    this.mapAccounts();
  }
}
</script>