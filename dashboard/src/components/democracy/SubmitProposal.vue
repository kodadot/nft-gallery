<template>
  <div>
    <Dropdown mode="accounts" @selected="handleAccountSelection" />
		<b-field label="preimage hash">
      <b-input v-model="preimageHash" > </b-input>
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

@Component({
  components: {
		Dropdown,
		Balance,
  },
})
export default class SubmitProposal extends Vue {
	private account: any = {};
	private password: string = '';
	private preimageHash: string = '';
	
	  private snackbarTypes = {
    success: {
      type: 'is-success',
      actionText: 'Hooray!',
      // onAction: () => window.open(this.explorer + this.tx, '_blank'),
    },
    info: {
      type: 'is-info',
      actionText: 'OK',
    },
    danger: {
      type: 'is-danger',
      actionText: 'Oh no!',
    },
  };

  public handleAccountSelection(account: KeyringPair) {
		this.account = account;
		
	}

	  public async shipIt(): Promise<void> {
    // if ((this as any).$http.api) {
    //   const apiResponse = await (this as any).$http.api.rpc.system.chain();
    //   this.conn.chainName = await apiResponse.toString();
    //   try {
    //     this.showNotification('Dispatched');
    //     const transfer =
    //     await (this as any).$http.api.tx.balances.transfer(this.to,
    //       this.balance);
    //     const nonce =
    //     await (this as any).$http.api.query.system.accountNonce(this.account.address);
    //     const alicePair = keyring.getPair(this.account.address);
    //     alicePair.decodePkcs8(this.password);
    //     console.log(await nonce.toString());
    //     const hash = await transfer.signAndSend(alicePair);
    //     this.showNotification(hash.toHex(), this.snackbarTypes.success);
    //     console.log('tx', hash.toHex());
    //     this.tx = hash.toHex();
    //   } catch (e) {
    //     this.showNotification(e, this.snackbarTypes.danger);
    //   }
    // }
  }
	
	public handleValue(value: any) {
    Object.keys(value).map((item) => {
      (this as any)[item] = value[item];
    });
	}
	
	 private showNotification(message: string | null, params = this.snackbarTypes.info) {
    this.$buefy.snackbar.open({
      duration: 5000,
      message: `${this.account.address} -> Proposal<br>${message}`,
      type: 'is-success',
      position: 'is-top-right',
      actionText: 'OK',
      queue: false,
      ...params,
    });
	}
}
</script>
