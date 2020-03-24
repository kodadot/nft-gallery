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
import { notificationTypes,  showNotification } from '@/utils/notification';
import exec from '@/utils/transactionExecutor';

export default class TxButton extends Vue {
  @Prop() public callback: any;
  @Prop() public params: any;
  @Prop() public disabled: boolean = false;
  @Prop() public account: boolean = false;
  @Prop() public password: boolean = false;

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
