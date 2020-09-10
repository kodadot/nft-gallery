<template>
	<ModalWrapper label="Add Proposal" icon="plus">
		<div>
		<AccountSelect label="submit with account" v-model="accountId" />
    <AccountSelect label="beneficiary" v-model="beneficiaryId" />
    <BalanceInput v-model="amount" />
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
import BalanceInput from '@/components/shared/BalanceInput.vue';
import AccountSelect from '@/components/shared/AccountSelect.vue'
import PasswordInput from '@/components/shared/PasswordInput.vue';

@Component({
	components: {
		ModalWrapper,
    AccountSelect,
    BalanceInput,
    PasswordInput
	},
})
export default class ProposalModal extends Vue {
  private accountId: string = '';
  private beneficiaryId: string = '';
	private password: string = '';
  private beneficiary: any = {};
  private amount: number = 0;
	
  public async shipIt() {
    const { api } = Connector.getInstance();

    if (!api) {
      return;
    }
    
    try {
      const { amount, beneficiaryId, accountId, password } = this;
      showNotification('Dispatched new proposal');
      console.log({ amount, beneficiaryId, accountId, password })
      const tx = await exec(accountId, password, api.tx.treasury.proposeSpend, [amount, beneficiaryId]);
      showNotification('Success', notificationTypes.success );
    } catch (e) {
      showNotification(e, notificationTypes.danger);
    }

  }
  
  get disabled() {
    return !this.accountId || !this.beneficiary || !this.amount
  }
  
}
</script>


<style scoped>
.password-wrapper {
  margin-top: 0.5em;
}
</style>
