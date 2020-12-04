<template>
	<ModalWrapper label="Add Tip" icon="plus">
		<div>
		<AccountSelect label="submit with account" v-model="accountId" />
    <AccountSelect label="beneficiary" v-model="beneficiaryId" />
    <b-field label="tip reason" >
      <b-input v-model="reason" > </b-input>
    </b-field>
		<PasswordInput v-model="password" />
    
      <b-button
        type="is-primary"
        icon-left="paper-plane"
        outlined
        :disabled="disabled"
        @click="shipIt"
      >
        Submit
      </b-button>
    </div>
		
	</ModalWrapper>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import ModalWrapper from './ModalWrapper.vue';
import Dropdown from '@/components/shared/Dropdown.vue';
import { KeyringPair } from '@polkadot/keyring/types';
import { notificationTypes,  showNotification } from '@/utils/notification';
import exec from '@/utils/transactionExecutor';
import { urlBuilderTransaction } from '@/utils/explorerGuide';
import Connector from '@vue-polkadot/vue-api';
import AccountSelect from '@/components/shared/AccountSelect.vue'
import PasswordInput from '@/components/shared/PasswordInput.vue';

@Component({
	components: {
		ModalWrapper,
		AccountSelect,
    PasswordInput
	},
})
export default class TipModal extends Vue {
	private accountId: string = '';
  private beneficiaryId: string = '';
	private password: string = '';
  private reason: string = '';
	
  public async shipIt() {
    const { api } = Connector.getInstance();

    if (!api) {
      return;
    }
    
    try {
      const { reason, beneficiaryId, accountId, password } = this;
      showNotification('Dispatched');
      const tx = await exec(accountId, this.password, api.tx.treasury.reportAwesome, [reason, beneficiaryId]);
      showNotification('[TIP] Success', notificationTypes.success);
    } catch (e) {
      showNotification(e, notificationTypes.danger);
    }

  }
  
  get disabled() {
    return !this.accountId || !this.beneficiaryId || !this.reason
  }
  
}
</script>
