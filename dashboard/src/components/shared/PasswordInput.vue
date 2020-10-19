<template>
  <b-field v-if="!accountLocked" label="password 🤫 magic spell" class="password-wrapper">
      <b-input :value="value" @input="handlePassword" type="password" password-reveal> </b-input>
    </b-field>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import keyring from '@polkadot/ui-keyring';

@Component
export default class PasswordInput extends Vue {
  private accountLocked: boolean = false;

  @Prop() public value!: string;
  @Prop({ default: '' }) public account!: string;

  public mounted() {
    if (this.account) {
      try {
        // TODO: missing isLocked from vue-keyring
        const acc = keyring.getAccount(this.account)
      } catch(err) {
        console.warn('[Password] unable to get account', err)
      }
      
      
    }
  }


  @Emit('input')
  private handlePassword(password: string) {
    return password;
  }

}
</script>
