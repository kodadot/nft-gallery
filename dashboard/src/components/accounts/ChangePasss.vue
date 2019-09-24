<template>
  <div class="changepass">
    Identicon
    {{address.slice(0, 6)}}…{{address.slice(-6)}}
    <b-field label="your current password" v-bind:type="{ 'is-danger': !isPassValid }">
      <b-input v-model="change.oldPass"
        @input="validatePassword(change.oldPass)"
        password-reveal></b-input>
    </b-field>
    <b-field label="your newpassword" v-bind:type="{ 'is-danger': !isPassValid }">
      <b-input v-model="change.newPass"
        @input="validatePassword(change.newPass)"
        password-reveal></b-input>
    </b-field>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import keyring from '@vue-polkadot/vue-keyring';

@Component({})
export default class ChangePass extends Vue {
  @Prop(String) public address!: string;

  public isPassValid: boolean = false;
  public change: object = {
    oldPass: null,
    newPass: null };
  public validatePassword(password: string): boolean {
    return this.isPassValid = keyring.isPassValid(password);
  }
}
</script>