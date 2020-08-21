<template>
	<ModalWrapper label="Add Tip" icon="plus">
		<div>
		<Dropdown mode="accounts" @selected="handleAccountSelection" />
    <Dropdown mode="accounts" @selected="handleBeneficiary" />
    <b-field label="reason" class="password-wrapper">
      <b-input v-model="reason" > </b-input>
    </b-field>
    
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

@Component({
	components: {
		ModalWrapper,
		Dropdown,
	},
})
export default class TipModal extends Vue {
	private account: any = {};
	private password: string = '';
  private beneficiary: any = {};
  private reason: string = '';
	


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
      const { reason, beneficiary } = this;
      showNotification('Dispatched');
      const tx = await exec(this.account, this.password, api.tx.treasury.reportAwesome, [reason, beneficiary.address]);
      // showNotification(`Second ${referendumId.toString()}`, { ...notificationTypes.success, onAction: this.onAction() });
    } catch (e) {
      showNotification(e, notificationTypes.danger);
    }

  }
  
  get disabled() {
    return !this.account || !this.password || !this.beneficiary || !this.reason
  }
  
}
</script>
