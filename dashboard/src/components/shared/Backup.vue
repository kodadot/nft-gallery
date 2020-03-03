<template>
  <div id="Backup">
    <b-field grouped multiline>
      <Identicon
        :value="address.toString()"
      />
      {{shortAddress(address)}}
      <b-button
      size="is-small" 
      icon-left="copy" 
      v-clipboard:copy="address"
      @click="toast('Address copied to clipboard')">
      </b-button>
    </b-field>
    <b-field label="password" v-bind:type="{ 'is-danger': !isPassValid }">
      <b-input v-model="password" type="password"
        @input="validatePassword(password)"
        password-reveal></b-input>
    </b-field>      
    <router-link to="/accounts">
      <b-button icon-left="cloud-download-alt" type="is-dark" 
        @click="makeBackup(address, password)" outlined>
        Backup
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
import { Component, Prop, Vue } from 'vue-property-decorator';
import Identicon from '@polkadot/vue-identicon';
import keyring from '@vue-polkadot/vue-keyring';
import FileSaver from 'file-saver';


@Component({
  components: {
    Identicon,
  }
})
export default class Backup extends Vue {
  @Prop(String) public address!: string;
  @Prop(String) public theme!: string;

  public password: string = '';
  public isPassValid: boolean = false;
  public validatePassword(password: string): boolean {
    return this.isPassValid = keyring.isPassValid(password);
  }

  public shortAddress(address: string): string {
    if (address) {
      return `${address.slice(0, 6)}...${address.slice(-6)}`;
    }
    return '';
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
