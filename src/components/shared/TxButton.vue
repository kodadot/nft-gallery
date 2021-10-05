<template>
  <b-button
    type="is-primary"
    icon-left="paper-plane"
    outlined
    disabled
  >
    Submit
  </b-button>
</template>

<script lang="ts">
import { Vue, Prop, Emit } from 'vue-property-decorator'
import { notificationTypes, showNotification } from '@/utils/notification'
import exec, { execResultValue } from '@/utils/transactionExecutor'
import { KeyringAccount } from '@/types'

export default class TxButton extends Vue {
  @Prop() public callback!: (...p: any) => Promise<any> | any;
  @Prop() public params!: any[];
  @Prop() public disabled!: boolean;
  @Prop() public account!: string | KeyringAccount;
  @Prop({ default: '' }) public password!: string;

  public async shipIt() {
    const { api } = (this as any).$http

    if (!api) {
      return
    }

    try {
      showNotification('Dispatched')
      const { account, password, callback, params } = this
      const tx = await exec(account, password, callback, params)
      showNotification(execResultValue(tx), notificationTypes.success)
      this.handleProcessed(tx)
    } catch (e: any) {
      showNotification(e, notificationTypes.danger)
      this.handleProcessed(e)
    }
  }

  @Emit('processed')
  public handleProcessed(state: any) {
    return state
  }
}
</script>
