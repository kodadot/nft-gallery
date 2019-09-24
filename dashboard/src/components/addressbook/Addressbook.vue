<template>
  <div id="addressbook">
    <p>Address book soon 🌱</p>
    <ul>
      <li
        v-for="acc in keyringAccounts"
        v-bind:key="acc.address"
      >
      </li>
    </ul>
  </div>  
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import Identicon from '@vue-polkadot/vue-identicon';
import keyring from '@vue-polkadot/vue-keyring';
import Keypair from './Keypair.vue';

@Component({
  components: {
    Identicon,
    Keypair,
  },
})
export default class AddressBook extends Vue {
  public keyringAccounts: any = [];
}
</script>