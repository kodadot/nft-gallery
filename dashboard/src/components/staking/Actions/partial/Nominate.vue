<template>
  <ModalWrapper icon="users" label="Nominate" type="is-danger" >
    <b-field label="Stash Account">
      <b-input placeholder="stashId" v-model="stashId" disabled />
    </b-field>
    <b-field label="Controller Account">
      <b-input placeholder="controllerId" v-model="controllerId" disabled />
    </b-field>
    <b-field label="password 🤫 magic spell" class="password-wrapper">
      <b-input v-model="password" type="password" password-reveal> </b-input>
    </b-field>
    <NominatePartial :targetValidatorIds="targetValidatorIds" :nominating="nominating" v-model="nominated" />

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
import NominatePartial from './NominatePartial.vue'

import Connector from '@vue-polkadot/vue-api';
import BN from 'bn.js'

const components = {
  ModalWrapper,
  BalanceInput,
  NominatePartial
};

const EMPTY_PROOF = new Uint8Array();

@Component({ components })
export default class Nominate extends Vue {
  @Prop() public stashId!: string;
  @Prop() public controllerId!: string;
  @Prop() private targetValidatorIds!: string[];
  @Prop() public readonly nominating!: string[];

  private password: string = '';
  private nominated: string[] = [];
  
  get callback() {
    const { api } = Connector.getInstance();
    return api.tx.staking.nominate;
  }

  get params() {
    return [this.nominated]
  }

  get disabled() {
    return !this.nominated.length;
  }

  private async submit() {
    try {
      const { controllerId: account, password, callback, params } = this;
      showNotification(`Dispatched ${params.toString()}`);
      const tx = await exec(account, password, callback, params);
      showNotification(tx, notificationTypes.success);
      console.log(`[Nominate] ${tx}`);
    } catch (e) {
      showNotification(e.message, notificationTypes.danger);
      console.error(e);
    }
  }
}
</script>
