<template>
  <div class="changepass">
    <Identicon
      :value="address.toString()"
      />
    {{shortAddress(address)}} 
    <b-field label="your current password" v-bind:type="{ 'is-danger': !isPassValid }">
      <b-input v-model="change.oldPass" type="password"
        @input="validatePassword(change.oldPass)"
        password-reveal></b-input>
    </b-field>
    <b-field label="your new password" v-bind:type="{ 'is-danger': !isPassValid }">
      <b-input v-model="change.newPass" type="password"
        @input="validatePassword(change.newPass)"
        password-reveal></b-input>
    </b-field>
    <router-link to="/accounts">
      <b-button @click="doChangePassword()"
        type="is-dark" icon-left="key" outlined>
        Change Passowrd
      </b-button>
    </router-link>
    <router-link to="/accounts">
      <b-button icon-left="times" type="is-warning" outlined>
        Cancel
      </b-button>
    </router-link>
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

  public shortAddress(address: string): string {
    if (address) {
      return `${address.slice(0, 6)}...${address.slice(-6)}`;
    }
    return '';
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
