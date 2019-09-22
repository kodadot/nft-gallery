<template>
  <div id="Restore">
      <FileLoad :accountToImport.sync="accountToImport" />
      <b-button type="is-light" @click="OnRestore()">
        <font-awesome-icon icon="sync"/>
        Restore Account</b-button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { u8aToString } from '@polkadot/util';
import keyring from '@vue-polkadot/vue-keyring';
import FileLoad from './FileLoad.vue';

@Component({
  components: {
    FileLoad,
  },
})
export default class Restore extends Vue {
  @Prop(String) public password!: string;

  public accountToImport: any = '';

  public OnRestore(): void {
    try {
      const json = JSON.parse(this.accountToImport);
      const pair = keyring.restoreAccount(json, this.password);
      this.$emit('refreshAccounts');
    } catch (error) {
      console.error(error);
    }
  }
}
</script>
