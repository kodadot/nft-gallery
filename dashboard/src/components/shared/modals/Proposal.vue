<template>
	<ModalWrapper label="Add Proposal" icon="plus">
		<div>
		<Dropdown mode="accounts" @selected="handleAccountSelection" />
    <Dropdown mode="accounts" @selected="handleBeneficiary" />
    <BalanceInput v-model="value" />
		<b-field label="password 🤫 magic spell" class="password-wrapper">
      <b-input v-model="password" type="password" password-reveal> </b-input>
    </b-field>
    
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
import C from '@vue-polkadot/vue-api'
import BalanceInput from '@/components/shared/BalanceInput.vue'

@Component({
	components: {
		ModalWrapper,
    Dropdown,
    BalanceInput,
	},
})
export default class ProposalModal extends Vue {
	private account: any = {};
	private password: string = '';
  private beneficiary: any = {};
  private value: number = 0;
	


  public handleAccountSelection(account: KeyringPair) {
		this.account = account;
  }
  
  public handleBeneficiary(account: KeyringPair) {
    console.log(account.address)
    this.beneficiary = account;
  }

  public async shipIt() {
    const { api } = C.getInstance()

    if (!api) {
      return;
    }
    
    try {
      const { value, beneficiary } = this;
      showNotification('Dispatched');
      const tx = await exec(this.account, this.password, api.tx.treasury.proposeSpend, [value, beneficiary.address]);
      // showNotification(`Second ${referendumId.toString()}`, { ...notificationTypes.success, onAction: this.onAction() });
    } catch (e) {
      showNotification(e, notificationTypes.danger);
    }

  }
  
  get disabled() {
    return !this.account || !this.password || !this.beneficiary || !this.value
  }
  
}
</script>


<style scoped>
.password-wrapper {
  margin-top: 0.5em;
}
</style>
