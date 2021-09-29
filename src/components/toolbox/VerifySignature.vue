<template>
  <div>
    <AccountSelect label="sign with following account" v-model="accountFrom" :asKeyring="true" />
    <b-field label="using the following data">
      <b-input v-model="data"
      @input="isHexData();complexVerifySignature()"
      :disabled="!accountFrom"></b-input>
    </b-field>
    <b-field label="the supplied signature"
      v-bind:type="{ 'is-success': validSignature, 'is-danger': !validSignature }">
      <b-input v-model="signature" @input="complexVerifySignature()"
      :disabled="!accountFrom"></b-input>
    </b-field>
    <b-field grouped>
      <DisabledInput label="hex input data" :expanded="true" :value="inputDataCheck" />
      <DisabledInput label="signature crypto type" :expanded="true" :value="cryptoType" />
    </b-field>
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { KeyringPair } from '@polkadot/keyring/types'
import { isHex, u8aToHex, hexToU8a, stringToU8a, u8aToString } from '@polkadot/util'
import keyring from '@polkadot/ui-keyring'
import DisabledInput from '@/components/shared/DisabledInput.vue'
import AccountSelect from '@/components/shared/AccountSelect.vue'
import { naclVerify, schnorrkelVerify } from '@polkadot/util-crypto'
import { emptyObject } from '@/utils/empty'

@Component({
  components: {
    AccountSelect,
    DisabledInput
  }
})
export default class VerifySignature extends Vue {
  private data: any = '';
  private signature = '';
  private inputDataCheck = 'No';
  private address: any = '';
  private accountFrom: KeyringPair = emptyObject<KeyringPair>();
  private validSignature = false;
  private isValidSignature = false;
  private keyringPubKey: any = '';
  private cryptoType = 'unknown'

  private isHexData(): void {
    this.inputDataCheck = isHex(this.data)
      ? 'Yes'
      : 'No'
  }

  // yet we think this is sub-optimal, but it works!
  private complexVerifySignature(): void {
    this.keyringPubKey = u8aToHex(this.accountFrom.publicKey)
    this.isValidSignature = isHex(this.signature) && this.signature.length === 130
    this.validSignature = false
    if (this.isValidSignature && this.keyringPubKey) {
      let isValidSr = false
      let isValidEd = false

      try {
        isValidEd = naclVerify(this.data, this.signature, this.keyringPubKey)
        this.validSignature = true
      } catch (error) {
        console.log(error)
      }

      if (isValidEd) {
        this.cryptoType = 'ed25519'
      } else {
        try {
          isValidSr = schnorrkelVerify(this.data, this.signature, this.keyringPubKey)
          this.validSignature = true
        } catch (error) {
          console.log(error)
        }

        if (isValidSr) {
          this.cryptoType = 'sr25519'
        } else {
          this.validSignature = false
        }
      }
    }
  }

  private handleAccountSelectionFrom(account: KeyringPair) {
    this.accountFrom = account
  }
}
</script>
