<template>
  <NeoField
    v-if="accountLocked"
    label="password 🤫 magic spell"
    class="password-wrapper">
    <NeoInput
      :value="value"
      type="password"
      password-reveal
      @input="handlePassword" />
  </NeoField>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'nuxt-property-decorator'
import { isAccountLocked } from '@/utils/account'
import { NeoField, NeoInput } from '@kodadot1/brick'

@Component({
  components: {
    NeoField,
    NeoInput,
  },
})
export default class PasswordInput extends Vue {
  @Prop() public value!: string
  @Prop({ default: '' }) public account!: string

  // public mounted() {
  //   if (this.account) {
  //     try {
  //       // TODO: missing isLocked from vue-keyring
  //       const acc = keyring.getAccount(this.account)
  //     } catch(err) {
  //       this.$consola.warn('[Password] unable to get account', err)
  //     }

  //   }
  // }

  get accountLocked(): boolean | string {
    return this.account && isAccountLocked(this.account)
  }

  @Emit('input')
  private handlePassword(password: string) {
    return password
  }
}
</script>
