<template>
  <div id="Restore">
      <FileLoad :accountToImport.sync="accountToImport" />
      <b-field label="password" v-bind:type="{ 'is-danger': !isPassValid }">
        <b-input v-model="password" type="password"
          @input="validatePassword(password)"
          password-reveal></b-input>
      </b-field>
      <router-link :to="{name: 'accounts'}">
        <b-button icon-left="sync" type="is-dark"
          @click="OnRestore()" outlined>
          Restore Account
        </b-button>
      </router-link>
      <router-link :to="{name: 'accounts'}">
        <b-button icon-left="times" type="is-warning" outlined>
          Cancel
        </b-button>
      </router-link>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator'
import { u8aToString } from '@polkadot/util'
import keyring from '@polkadot/ui-keyring'
import FileLoad from '../FileLoad.vue'

@Component({
  components: {
    FileLoad,
  },
})
export default class Restore extends Vue {
  public accountToImport = '';
  public password = '';
  public isPassValid = false;
  public validatePassword(password: string): boolean {
    return this.isPassValid = keyring.isPassValid(password)
  }
  @Emit()
  public OnRestore(): void {
    try {
      const json = JSON.parse(this.accountToImport)
      const pair = keyring.restoreAccount(json, this.password)
    } catch (error) {
      console.error(error)
    }
  }
}
</script>
