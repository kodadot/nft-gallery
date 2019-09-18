<template>
  <div id="Restore">
      <FileLoad :accountToImport.sync="accountToImport" />
      <button @click="OnRestore()">Restore</button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import keyring from '@vue-polkadot/vue-keyring';
import FileLoad from './FileLoad.vue';

@Component({
  components: {
    FileLoad,
  },
})
export default class Keypair extends Vue {
  @Prop(String) public password!: string;

  public accountToImport: any = '';
  public OnRestore(): void {
    try {
      const pair = keyring.restoreAccount(this.accountToImport, this.password);
    } catch (error) {
      console.error(error);
    }
  }
}
</script>
