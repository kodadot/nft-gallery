<template>
  <div id="addressbook">
    <p>Address book soon 🌱</p>
    <p>5CPjD48eo47mRR5J1MvahXsaTAD1x2m7fGNmsvVb1ynrT2z3</p>
    <p>5CigBWKMkumrHoJ6CHComH43LAWBh192sXZpm4Xrzqe9umz1</p>
    <b-button @click="isKeyringLoaded">isKeyring</b-button>
    <b-button @click="mapAccounts">map</b-button>
    <Create v-if="isKeyringLoaded"
      @on-create="mapAccounts" />
    <ul>
      <li
        v-for="acc in keyringAccounts"
        v-bind:key="acc.address"
      > 
      <Keypair v-if="isKeyringLoaded && acc.meta.isExternal"
        :address="acc.address"
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
  public keys: any = '';

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