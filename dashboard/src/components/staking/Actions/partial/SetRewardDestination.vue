<template>
  <ModalWrapper icon="coins" label="Change Reward Destination">
    <b-field label="Stash Account">
      <b-input placeholder="StashId" v-model="stashId" disabled />
    </b-field>
        <b-field label="Controller Account">
      <b-input placeholder="StashId" v-model="controllerId" disabled />
    </b-field>
    <b-field label="Payment destination">
            <b-select placeholder="Select destination" v-model="destination">
                <option
                    v-for="option in options"
                    :value="option.value"
                    :key="option.value">
                    {{ option.text }}
                </option>
            </b-select>
        </b-field>
    <b-field label="password 🤫 magic spell" class="password-wrapper">
      <b-input v-model="password" type="password" password-reveal> </b-input>
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
import { rewardDestinationOptions } from '../constants';

import Connector from '@vue-polkadot/vue-api';

const components = {
  ModalWrapper,
  BalanceInput
};

@Component({ components })
export default class SetRewardDestination extends Vue {
  @Prop() public stashId!: string;
  @Prop() public controllerId!: string;
  
  private account: string = '';
  private password: string = '';
  private destination: number = 0;

  get options() {
    return rewardDestinationOptions;
  }

  get callback() {
    const { api } = Connector.getInstance();
    return api.tx.staking.setPayee;
  }

  get params() {
    return [this.destination];
  }

  get disabled() {
    return false;
  }

    public handleAccountSelection(account: KeyringPair) {
    this.account = account.address;
  }

  private async submit() {
       try {
      const { stashId: account, password, callback, params } = this;
      showNotification(`Dispatched`);
      console.log(params);
      const tx = await exec(account, password, callback, params);
      showNotification(tx, notificationTypes.success);
      console.log(`[SetControllerAccount] ${tx}`);
    } catch (e) {
      showNotification(e.message , notificationTypes.danger);
      console.error(e)
    }

  }
}
</script>
