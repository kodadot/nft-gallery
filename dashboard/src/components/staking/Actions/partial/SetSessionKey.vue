<template>
  <ModalWrapper icon="key" label="Change Session Keys">
    <b-field label="Stash Account">
      <b-input placeholder="StashId" v-model="stashId" disabled />
    </b-field>
    <b-field label="Controller Account">
      <b-input placeholder="StashId" v-model="controllerId" disabled />
    </b-field>
    <b-field label="password 🤫 magic spell" class="password-wrapper">
      <b-input v-model="password" type="password" password-reveal> </b-input>
    </b-field>
    <b-field label="Session Keys">
      <b-input placeholder="0x..." v-model="keys" />
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
import { isHex } from '@polkadot/util';

import Connector from '@vue-polkadot/vue-api';
import BN from 'bn.js';

const components = {
  ModalWrapper,
  BalanceInput
};

const EMPTY_PROOF = new Uint8Array();

@Component({ components })
export default class SetSessionKey extends Vue {
  @Prop() public stashId!: string;
  @Prop() public controllerId!: string;

  private account: string = '';
  private password: string = '';
  private keys: string = '';

  get callback() {
    const { api } = Connector.getInstance();
    return api.tx.session.setKeys;
  }

  get params() {
    return [this.keys, EMPTY_PROOF];
  }

  get disabled() {
    return !(this.stashId && isHex(this.keys));
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
      showNotification(e.message, notificationTypes.danger);
      console.error(e);
    }
  }
}
</script>
