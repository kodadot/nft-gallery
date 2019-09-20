<template>
  <div id="Backup">
      <b-button type="is-light" @click="makeBackup(address, password)">
        <font-awesome-icon icon="cloud-download-alt"/>
        Backup</b-button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import FileSaver from 'file-saver';
import keyring from '@vue-polkadot/vue-keyring';

@Component({})
export default class Backup extends Vue {
  @Prop(String) public address!: string;
  @Prop(String) public password!: string;

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
