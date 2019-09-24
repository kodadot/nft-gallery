<template>
  <div id="Restore">
      <FileLoad :accountToImport.sync="accountToImport" />
      <b-field label="password" v-bind:type="{ 'is-danger': !isPassValid }">
        <b-input v-model="password"
          @input="validatePassword(password)"
          password-reveal></b-input>
      </b-field>   
      <b-button type="is-primary" @click="OnRestore()">
        <font-awesome-icon icon="sync"/>
        Restore Account</b-button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import { u8aToString } from '@polkadot/util';
import keyring from '@vue-polkadot/vue-keyring';
import FileLoad from './FileLoad.vue';

@Component({
  components: {
    FileLoad,
  },
})
export default class Restore extends Vue {
  public accountToImport: string = '';
  public password: string = '';
  public isPassValid: boolean = false;
  public validatePassword(password: string): boolean {
    return this.isPassValid = keyring.isPassValid(password);
  }
  @Emit()
  public OnRestore(): void {
    try {
      const json = JSON.parse(this.accountToImport);
      const pair = keyring.restoreAccount(json, this.password);
    } catch (error) {
      console.error(error);
    }
  }
}
</script>
