<template>
  <div>
    <AccountSelect label="sign with following account" v-model="account" :asKeyring="true" />
    <b-field label="sign the following data">
      <b-input v-model="input" />
    </b-field>
    <PasswordInput v-model="password" />

    <b-button icon-left="key" @click="signData"
      :disabled="!accountFrom">Sign Message</b-button>
    <br>
    <br>
    <DisabledInput label="hex input data" :value="isHexData" />
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
import { Component, Vue} from 'vue-property-decorator'
import { KeyringPair } from '@polkadot/keyring/types'
import { isHex, u8aToHex, hexToU8a, stringToU8a } from '@polkadot/util'
import DisabledInput from '@/components/shared/DisabledInput.vue'
import AccountSelect from '@/components/shared/AccountSelect.vue'
import PasswordInput from '@/components/shared/PasswordInput.vue'
import { emptyObject } from '@/utils/empty'

@Component({
  components: {
    DisabledInput,
    AccountSelect,
    PasswordInput
  }
})
export default class SignMessage extends Vue {
  private password: any = '';
  private address: any = '';
  private input = '';
  private signature: any = '';
  private inputDataCheck = 'No';
  private account: KeyringPair = emptyObject<KeyringPair>();
  private currentPair: any = null;

  get isHexData(): string {
    return String(isHex(this.input))
  }

  get accountFrom(): boolean {
    return !!this.account.address
  }

  private signData(): void {
    if (this.password) {
      this.account.decodePkcs8(this.password)
    }

    this.signature = u8aToHex(
      this.account.sign(
        isHex(this.input)
          ? hexToU8a(this.input)
          : stringToU8a(this.input)
      )
    )
  }

  private toast(message: string): void {
    this.$buefy.toast.open(message)
  }
}
</script>
