<template>
  <div id="Backup">
      <button @click="makeBackup(address, password)">Backup</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import FileSaver from 'file-saver';
import keyring from '@vue-polkadot/vue-keyring';

@Component({})
export default class Keypair extends Vue {
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
