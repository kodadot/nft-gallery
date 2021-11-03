<template>
  <div id="Backup">
    <b-field
      grouped
      multiline
    >
      <Identicon
        :value="address.toString()"
        :size="size"
      />
      {{ shortAddress(address) }}
      <b-button
        v-clipboard:copy="address"
        size="is-small"
        icon-left="copy"
        @click="toast('Address copied to clipboard')"
      />
    </b-field>
    <b-field
      label="password"
      :type="{ 'is-danger': !isPassValid }"
    >
      <b-input
        v-model="password"
        type="password"
        password-reveal
        @input="validatePassword(password)"
      />
    </b-field>
    <router-link :to="{name: 'accounts'}">
      <b-button
        icon-left="cloud-download-alt"
        type="is-dark"
        outlined
        @click="makeBackup(address, password)"
      >
        Backup
      </b-button>
    </router-link>
    <router-link :to="{name: 'accounts'}">
      <b-button
        icon-left="times"
        type="is-warning"
        outlined
      >
        Cancel
      </b-button>
    </router-link>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import Identicon from '@polkadot/vue-identicon'
import keyring from '@polkadot/ui-keyring'
import FileSaver from 'file-saver'


@Component({
  components: {
    Identicon,
  },
})
export default class Backup extends Vue {
  @Prop(String) public address!: string;
  @Prop(String) public theme!: string;
  @Prop({ default: 64 }) public size!: number;


  public password = '';
  public isPassValid = false;
  public validatePassword(password: string): boolean {
    return this.isPassValid = keyring.isPassValid(password)
  }

  public shortAddress(address: string): string {
    if (address) {
      return `${address.slice(0, 6)}...${address.slice(-6)}`
    }
    return ''
  }

  public makeBackup(address: string, password: string): void {
    if (!address) {
      return
    }

    try {
      const addressKeyring = address && keyring.getPair(address)
      const json = addressKeyring && keyring.backupAccount(addressKeyring, password)
      const blob = new Blob([JSON.stringify(json)], { type: 'application/json; charset=utf-8' })

      FileSaver.saveAs(blob, `${address}.json`)
    } catch (error) {
      console.error(error)
      return
    }
  }
}
</script>
