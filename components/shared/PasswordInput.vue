<template>
  <b-field
    v-if="accountLocked"
    label="password 🤫 magic spell"
    class="password-wrapper"
  >
    <b-input
      :value="value"
      type="password"
      password-reveal
      @input="handlePassword"
    />
  </b-field>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Emit } from 'nuxt-property-decorator'
import { isAccountLocked } from '@/utils/account'

@Component
export default class PasswordInput extends Vue {
  @Prop() public value!: string
  @Prop({ default: '' }) public account!: string

  // public mounted() {
  //   if (this.account) {
  //     try {
  //       // TODO: missing isLocked from vue-keyring
  //       const acc = keyring.getAccount(this.account)
  //     } catch(err) {
  //       console.warn('[Password] unable to get account', err)
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
