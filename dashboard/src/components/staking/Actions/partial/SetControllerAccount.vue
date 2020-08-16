<template>
  <ModalWrapper icon="users-cog" label="Change Controller Account">
    <b-field label="Stash Account">
      <b-input placeholder="StashId" v-model="stashId" disabled />
    </b-field>
    <Dropdown mode="accounts" @selected="handleAccountSelection" />
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
import Dropdown from '@/components/shared/Dropdown.vue';

import Connector from '@vue-polkadot/vue-api';

const components = {
  ModalWrapper,
  BalanceInput,
  Dropdown
};

@Component({ components })
export default class SetControllerAccount extends Vue {
  @Prop() public stashId!: string;
  @Prop() public controllerId!: string;
  
  private account: string = '';
  private password: string = '';

  get callback() {
    const { api } = Connector.getInstance();
    return api.tx.staking.setController;
  }

  get params() {
    return [this.account];
  }

  get disabled() {
    return !(this.stashId && this.account)
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
      console.timeStamp(`[SetControllerAccount] ${tx}`);
    } catch (e) {
      showNotification(e.message , notificationTypes.danger);
      console.error(e)
    }

  }
}
</script>
