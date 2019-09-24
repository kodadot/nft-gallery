<template>
  <div id="Backup">
    <b-field label="password" v-bind:type="{ 'is-danger': !isPassValid }">
      <b-input v-model="password"
        @input="validatePassword(password)"
        password-reveal></b-input>
    </b-field>      
    <b-button type="is-primary" @click="makeBackup(address, password)">
      <font-awesome-icon icon="cloud-download-alt"/>
      Backup
    </b-button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import FileSaver from 'file-saver';
import keyring from '@vue-polkadot/vue-keyring';

@Component({})
export default class Backup extends Vue {
  @Prop(String) public address!: string;

  public password: string = null;
  public isPassValid: boolean = false;
  public validatePassword(password: string): boolean {
    return this.isPassValid = keyring.isPassValid(password);
  }
  public makeBackup(address: string, password: string): void {
    if (!address) {
      return;
    }

    try {
      const addressKeyring = address && keyring.getPair(address);
      const json = addressKeyring && keyring.backupAccount(addressKeyring, password);
      const blob = new Blob([JSON.stringify(json)], { type: 'application/json; charset=utf-8' });

      FileSaver.saveAs(blob, `${address}.json`);
    } catch (error) {
      console.error(error);
      return;
    }
  }
}
</script>
