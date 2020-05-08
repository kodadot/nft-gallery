<template>
  <div>
    <Dropdown nobalance="true" mode='accounts' :externalAddress="address"
      @selected="handleAccountSelectionFrom" />
      <br>
    <b-field label="sign the following data">
      <b-input v-model="input" @input="isHexData()"></b-input>
    </b-field>
    <b-field label="password 🤫 magic spell" class="password-wrapper">
      <b-input v-model="password" type="password" password-reveal>
      </b-input>
    </b-field>
    
    <b-button icon-left="key" @click="signData()">Sign Message</b-button>
    <br>
    <br>
    <DisabledInput label="hex input data" :value="inputDataCheck" />
    <b-field label="signature">
      <b-input :value="signature" expanded disabled/>
      <b-button
        size="is-large"
        icon-left="copy" 
        v-clipboard:copy="signature"
        @click="toast('Signature has been copied')">
      </b-button>
    </b-field>
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { KeyringPair } from '@polkadot/keyring/types';
import keyring from '@vue-polkadot/vue-keyring';
import { isHex, u8aToHex, hexToU8a, stringToU8a, u8aToString } from '@polkadot/util';
import DisabledInput from '@/components/shared/DisabledInput.vue';
import Dropdown from '@/components/shared/Dropdown.vue';

@Component({
  components: {
    DisabledInput,
    Dropdown,
  }
})
export default class SignMessage extends Vue {
  private password: any = '';
  private address: any = '';
  private input: string = '';
  private signature: any = '';
  private inputDataCheck: string = 'No';
  private accountFrom: any = null;
  private currentPair: any = null;

  private isHexData(): void {
    this.inputDataCheck = isHex(this.input)
      ? 'Yes'
      : 'No';
  }

  private signData(): void {
    this.isHexData();
    this.accountFrom.decodePkcs8(this.password)
    this.signature = u8aToHex(
      this.accountFrom.sign(
        isHex(this.input)
          ? hexToU8a(this.input)
          : stringToU8a(this.input)
      )
    )
  }

  private handleAccountSelectionFrom(account: KeyringPair) {
    this.accountFrom = account;
  }

  private toast(message: string): void {
    this.$buefy.toast.open(message);
  }
}
</script>
