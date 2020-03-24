<template>
  <div>
    <Dropdown mode="accounts" @selected="handleAccountSelection" />
    <b-field label="password 🤫 magic spell" class="password-wrapper">
      <b-input v-model="password" type="password" password-reveal> </b-input>
    </b-field>
    <TxButton @processed="handleProcessed" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import Dropdown from '@/components/shared/Dropdown.vue';
import Extrinsics from '@/views/Extrinsics.vue';
import { blake2AsHex } from '@polkadot/util-crypto';
import { KeyringPair } from '@polkadot/keyring/types';
import TxButton from '@/components/shared/TxButton.vue';

@Component({
  components: {
    Dropdown,
    Extrinsics,
    TxButton,
  },
})
export default class Preimage extends Vue {
  private account: any = null;
  private password: string = '';


  public handleAccountSelection(account: KeyringPair) {
    this.account = account;
  }

  public handleProcessed(callValue: any) {
    console.info('handleProcessed', callValue);
  }
}
</script>
