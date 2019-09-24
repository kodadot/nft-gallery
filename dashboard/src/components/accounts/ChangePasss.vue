<template>
  <div class="changepass">
    <Identicon
      :value="address"
      :theme="theme"
      :size="size" />
    {{address.slice(0, 6)}}…{{address.slice(-6)}}
    <b-field label="your current password" v-bind:type="{ 'is-danger': !isPassValid }">
      <b-input v-model="change.oldPass"
        @input="validatePassword(change.oldPass)"
        password-reveal></b-input>
    </b-field>
    <b-field label="your new password" v-bind:type="{ 'is-danger': !isPassValid }">
      <b-input v-model="change.newPass"
        @input="validatePassword(change.newPass)"
        password-reveal></b-input>
    </b-field>
    <b-button @click="doChangePassword()"
      type="is-primary">
      Change Passowrd
    </b-button>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import Identicon from '@vue-polkadot/vue-identicon';
import keyring from '@vue-polkadot/vue-keyring';

@Component({
  components:
    {
      Identicon,
    },
})
export default class ChangePass extends Vue {
  @Prop(String) public address!: string;
  @Prop(String) public theme!: string;
  @Prop({ default: 64 }) public size!: number;

  public isPassValid: boolean = false;
  public change: any = {
    oldPass: null,
    newPass: null };
  public validatePassword(password: string): boolean {
    return this.isPassValid = keyring.isPassValid(password);
  }

  @Emit()
  public doChangePassword(): void {
    try {
      const account = this.address && keyring.getPair(this.address);

      if (!account) {
        return;
      }

      try {
        if (!account.isLocked) {
          account.lock();
        }

        account.decodePkcs8(this.change.oldPass);
      } catch (error) {
        console.error(error);
        return;
      }

      try {
        keyring.encryptAccount(account, this.change.newPass);
      } catch (error) {
        console.error(error);
        return;
      }
    } catch (error) {
      console.error(error);
      return;
    }
  }
}
</script>