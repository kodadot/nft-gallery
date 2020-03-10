<template>
  <div>
    <Dropdown mode="accounts" @selected="handleAccountSelection" />
		<b-field label="preimage hash">
      <b-input v-model="hash" > </b-input>
    </b-field>
    <Balance
      :argument="{ name: 'balance', type: 'balance' }"
      @selected="handleValue"
    />
    <b-field label="password 🤫 magic spell" class="password-wrapper">
      <b-input v-model="password" type="password" password-reveal> </b-input>
    </b-field>
    <div class="transaction buttons">
      <b-button
        type="is-primary"
        icon-left="paper-plane"
        outlined
        :disabled="!account || !password"
        @click="shipIt"
      >
        Submit
      </b-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import Dropdown from '@/components/shared/Dropdown.vue';
import { KeyringPair } from '@polkadot/keyring/types';
import keyring from '@vue-polkadot/vue-keyring';
import Balance from '@/params/components/Balance.vue';
import { notificationTypes,  showNotification } from '@/utils/notification';
import exec from '@/utils/transactionExecutor';

@Component({
  components: {
		Dropdown,
		Balance,
  },
})
export default class SubmitProposal extends Vue {
	private account: any = {};
	private password: string = '';
	private hash: string = '';
  private tx: string = '';
  private balance: number = 0;

  public handleAccountSelection(account: KeyringPair) {
		this.account = account;
		
	}

	public async shipIt() {
		const { api } = (this as any).$http;

		if (!api) {
			return;
		}
		
		try {
			showNotification('Dispatched');
			const { hash, balance } = this;
			this.tx = await exec(this.account, this.password, api.tx.democracy.propose, [hash, balance]);
			showNotification(this.tx, notificationTypes.success);
		} catch (e) {
			showNotification(e, notificationTypes.danger);
		}

	}
	
	public handleValue(value: any) {
    console.log(value);
    
    Object.keys(value).map((item) => {
      (this as any)[item] = value[item];
    });
	}
	
}
</script>
