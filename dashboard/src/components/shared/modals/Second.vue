<template>
	<ModalWrapper label="Second" icon="users">
		<div>
		<h3>#{{referendumId.toString()}}</h3>
		<Dropdown mode="accounts" @selected="handleAccountSelection" />
		<b-field label="password 🤫 magic spell" class="password-wrapper">
      <b-input v-model="password" type="password" password-reveal> </b-input>
    </b-field>
    
      <b-button
        type="is-primary"
        icon-left="paper-plane"
        outlined
        :disabled="!account || !password"
        @click="shipIt"
      >
        Submit
      </b-button>
			<ViewTransaction v-if="tx" :tx="tx"/>
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
import ViewTransaction from '../ViewTransaction.vue'

@Component({
	components: {
		ModalWrapper,
		Dropdown,
		ViewTransaction,
	},
})
export default class Second extends Vue {
	@Prop() public referendumId!: any;

	private account: any = {};
	private password: string = '';
	private vote: any = null;
	private tx: string = '';
	private explorer: string = 'https://polkascan.io/pre/kusama/transaction/';
	

  public handleAccountSelection(account: KeyringPair) {
		this.account = account;
	}

	public handleVote(vote: boolean) {
		this.vote = vote;
	}

		public async shipIt() {
		const { api } = (this as any).$http;

		if (!api) {
			return;
		}
		
		try {
			showNotification('Dispatched');
			const { referendumId } = this;
			this.tx = await exec(this.account, this.password, api.tx.democracy.second, [referendumId]);
			showNotification(`Second ${referendumId.toString()}`, { ...notificationTypes.success, onAction: this.onAction() });
		} catch (e) {
			showNotification(e, notificationTypes.danger);
		}

	}

	public onAction() {
		return () => window.open(this.explorer + this.tx, '_blank')
	}
  
}
</script>
