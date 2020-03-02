<template>
	<ModalWrapper label="Vote" icon="plus">
		<div>
		<h3>#{{referendumId.toString()}}</h3>
		<Dropdown mode="accounts" @selected="handleAccountSelection" />
		<VoteDropdown @selected="handler" />
		<Conviction @selected="handler" />
		<b-field label="password 🤫 magic spell" class="password-wrapper">
      <b-input v-model="password" type="password" password-reveal> </b-input>
    </b-field>
    
      <b-button
        type="is-primary"
        icon-left="paper-plane"
        outlined
        :disabled="!account || !password || isVoteEmpty() || !referendumId"
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
import VoteDropdown from '@/components/democracy/VoteDropdown.vue';
import Conviction from '@/components/democracy/Conviction.vue';
import keyring from '@vue-polkadot/vue-keyring';
import { notificationTypes,  showNotification } from '@/utils/notification';
import exec from '@/utils/transactionExecutor';
import ViewTransaction from '../ViewTransaction.vue';


@Component({
	components: {
		ModalWrapper,
		Dropdown,
		VoteDropdown,
		Conviction,
		ViewTransaction,
	},
})
export default class Vote extends Vue {
	
	@Prop() public referendumId!: any;
	private account: any = {};
	private password: string = '';
	private tx: string = '';
	
	private vote: any = {
		aye: null,
		conviction: null,
	};

  public handleAccountSelection(account: KeyringPair) {
		this.account = account;
	}

	public handler(vote: any) {
		this.vote = {...this.vote, ...vote};
		console.warn(this.vote);
		
	}

	public async shipIt() {
		const { api } = (this as any).$http;

		if (!api) {
			return;
		}
		
		try {
			showNotification('Dispatched');
			const { referendumId, vote } = this;
			const { aye, conviction } = vote;
			this.tx = await exec(this.account, this.password, api.tx.democracy.vote, [referendumId, { aye, conviction }]);
			showNotification(this.tx, notificationTypes.success);
		} catch (e) {
			showNotification(e, notificationTypes.danger);
		}

	}

	private isVoteEmpty() {
		return !this.vote.aye || this.vote.conviction === null;
	}
  
}
</script>
