<template>
  <div>
    <AccountSelect
      v-model="accountFrom"
      label="sign with following account"
      :as-keyring="true" />
    <b-field label="using the following data">
      <b-input
        v-model="data"
        :disabled="!accountFrom"
        @input="
          isHexData()
          complexVerifySignature()
        " />
    </b-field>
    <b-field
      label="the supplied signature"
      :type="{ 'is-success': validSignature, 'is-danger': !validSignature }">
      <b-input
        v-model="signature"
        :disabled="!accountFrom"
        @input="complexVerifySignature()" />
    </b-field>
    <b-field grouped>
      <DisabledInput
        label="hex input data"
        :expanded="true"
        :value="inputDataCheck" />
      <DisabledInput
        label="signature crypto type"
        :expanded="true"
        :value="cryptoType" />
    </b-field>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { KeyringPair } from '@polkadot/keyring/types'
import { isHex, u8aToHex } from '@polkadot/util'
import DisabledInput from '@/components/shared/DisabledInput.vue'
import AccountSelect from '@/components/shared/AccountSelect.vue'
// import { signatureVerify } from '@polkadot/util-crypto'
import { emptyObject } from '@/utils/empty'

@Component({
  components: {
    AccountSelect,
    DisabledInput,
  },
})
export default class VerifySignature extends Vue {
  private data: any = ''
  private signature = ''
  private inputDataCheck = 'No'
  private address: any = ''
  private accountFrom: KeyringPair = emptyObject<KeyringPair>()
  private validSignature = false
  private isValidSignature = false
  private keyringPubKey: any = ''
  private cryptoType = 'unknown'

  private isHexData(): void {
    this.inputDataCheck = isHex(this.data) ? 'Yes' : 'No'
  }

  // yet we think this is sub-optimal, but it works!
  private complexVerifySignature(): void {
    // TODO: signatureVerify
  }

  private handleAccountSelectionFrom(account: KeyringPair) {
    this.accountFrom = account
  }
}
</script>
