<template>
  <ModalWrapper icon="percent" label="Change Validator Preferences">
    <b-field label="Stash Account">
      <b-input placeholder="StashId" v-model="stashId" disabled />
    </b-field>
    <b-field label="Controller Account">
      <b-input placeholder="StashId" v-model="controllerId" disabled />
    </b-field>
    <b-field label="password 🤫 magic spell" class="password-wrapper">
      <b-input v-model="password" type="password" password-reveal> </b-input>
    </b-field>
    <b-field label="Commission" >
      <b-input v-model="commission" /> 
    </b-field>

    <b-button
      type="is-primary"
      icon-left="paper-plane"
      outlined
      :disabled="disabled"
      @click="submit"
    >
      Submit
    </b-button>
  </ModalWrapper>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import ModalWrapper from '@/components/shared/modals/ModalWrapper.vue';
import BalanceInput from '@/components/shared/BalanceInput.vue';
import exec from '@/utils/transactionExecutor';
import { notificationTypes, showNotification } from '@/utils/notification';
import { KeyringPair } from '@polkadot/keyring/types';
import { BN_ZERO, BN_HUNDRED as MAX_COMM } from '@polkadot/util';

import Connector from '@vue-polkadot/vue-api';
import BN from 'bn.js'

const components = {
  ModalWrapper,
  BalanceInput
};

const COMM_MUL = new BN(1e7);

@Component({ components })
export default class SetCommision extends Vue {
  @Prop() public stashId!: string;
  @Prop() public controllerId!: string;
  @Prop() public actualCommision!: number;

  private account: string = '';
  private password: string = '';
  private commission: number = 0;

  public mounted() {
    if (this.actualCommision) {
      this.commission = this.actualCommision;
    }
  }

  get callback() {
    const { api } = Connector.getInstance();
    return api.tx.staking.validate;
  }

  get params() {
    const commission = (new BN(this.commission) || BN_ZERO).mul(COMM_MUL);
    return [{
      commission: commission.isZero() ? 1 : commission
    }];
  }

  get disabled() {
    return !this.commission;
  }

  public handleAccountSelection(account: KeyringPair) {
    this.account = account.address;
  }

  private async submit() {
    try {
      const { stashId: account, password, callback, params } = this;
      showNotification(`Dispatched ${params.toString()}`);
      const tx = await exec(account, password, callback, params);
      showNotification(tx, notificationTypes.success);
      console.log(`[SetCommision] ${tx}`);
    } catch (e) {
      showNotification(e.message, notificationTypes.danger);
      console.error(e);
    }
  }
}
</script>
