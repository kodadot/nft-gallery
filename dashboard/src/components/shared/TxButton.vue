<template>
  <b-button
    type="is-primary"
    icon-left="paper-plane"
    outlined
    :disabled="disabled"
    @click="shipIt"
  >
    Submit
  </b-button>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import { notificationTypes, showNotification } from '@/utils/notification';
import exec from '@/utils/transactionExecutor';
import { KeyringAccount } from '@/types';

export default class TxButton extends Vue {
  @Prop() public readonly callback!: (...p: any) => Promise<any> | any;
  @Prop() public readonly params!: any[];
  @Prop() public readonly disabled!: boolean;
  @Prop() public readonly account!: string | KeyringAccount;
  @Prop({ default: '' }) public readonly password!: string;

  public async shipIt() {
    const { api } = (this as any).$http;

    if (!api) {
      return;
    }

    try {
      showNotification('Dispatched');
      const { account, password, callback, params } = this;
      const tx = await exec(account, password, callback, params);
      showNotification(tx, notificationTypes.success);
      this.handleProcessed(tx);
    } catch (e) {
      showNotification(e, notificationTypes.danger);
      this.handleProcessed(e);
    }
  }

  @Emit('processed')
  public handleProcessed(state: any) {
    return state;
  }
}
</script>
