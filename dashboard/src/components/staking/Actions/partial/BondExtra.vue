<template>
  <ModalWrapper icon="plus" label="Bond more funds">
    <b-field label="StashId">
      <b-input placeholder="StashId" v-model="stashId" disabled />
    </b-field>
    <b-field label="password 🤫 magic spell" class="password-wrapper">
      <b-input v-model="password" type="password" password-reveal> </b-input>
    </b-field>
    <BalanceInput v-model="value" />
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

import Connector from '@vue-polkadot/vue-api';

const components = {
  ModalWrapper,
  BalanceInput
};

@Component({ components })
export default class BondExtra extends Vue {
  @Prop() public stashId!: string;
  private value: number = 0;
  private password: string = '';

  get callback() {
    const { api } = Connector.getInstance();
    return api.tx.staking.bondExtra;
  }

  get params() {
    return [this.value];
  }

  get disabled() {
    return !(this.stashId && this.value)
  }

  private async submit() {
       try {
      const { stashId: account, password, callback, params } = this;
      showNotification(`Dispatched ${params.toString()}`);
      const tx = await exec(account, password, callback, params);
      showNotification(tx, notificationTypes.success);
      console.timeStamp(`Bond Extra ${tx}`);
    } catch (e) {
      showNotification(e.message , notificationTypes.danger);
      console.error(e)
    }

  }
}
</script>
