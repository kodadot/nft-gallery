<vue-<template>
  <div>
    <Dropdown nobalance="true" :externalAddress="address"
      @selected="handleAccountSelectionFrom" />
      <br>
    <b-field label="using the following data">
      <b-input v-model="data" @input="isHexData()"></b-input>
    </b-field>
    <b-field label="the supplied signature">
      <b-input v-model="signature" @input="verifySignature()"></b-input>
    </b-field>
    <!-- <b-button icon-left="key" @click="signData()">Sign Message</b-button> -->
    <DisabledInput label="hex input data" :value="inputDataCheck" />
    <DisabledInput label="valid signature" :value="validSignature" />
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { KeyringPair } from '@polkadot/keyring/types';
import { isHex, u8aToHex, hexToU8a, stringToU8a, u8aToString } from '@polkadot/util';
import keyring from '@vue-polkadot/vue-keyring';
import DisabledInput from '@/components/shared/DisabledInput.vue';
import Dropdown from '@/components/shared/Dropdown.vue';
import { schnorrkelVerify } from '@polkadot/util-crypto';

@Component({
  components: {
    Dropdown,
    DisabledInput
  }
})
export default class VerifySignature extends Vue {
  private data: any = '';
  private signature: string = '';
  private inputDataCheck: any = '';
  private address: any = '';
  private accountFrom: any = null;
  private validSignature: boolean = false;
  private keyringPubKey: any = '';
  
  private isHexData(): void {
    this.inputDataCheck = isHex(this.data)
      ? 'Yes'
      : 'No';
  }

  private verifySignature(): void {
    this.isHexData();
    this.keyringPubKey = u8aToHex(this.accountFrom.publicKey)
    if (isHex(this.signature)) {
      this.validSignature = schnorrkelVerify(
        this.data, this.signature, this.keyringPubKey)
    }
  }

  private handleAccountSelectionFrom(account: KeyringPair) {
    this.accountFrom = account;
  }
}
</script>
