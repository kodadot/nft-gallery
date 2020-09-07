<template>
  <ModalWrapper icon="plus" label="Stash" type="is-primary">
    <BondPartial v-model="bondCallback" />
    <div class="filler" />
    <b-button
      type="is-primary"
      icon-left="paper-plane"
      outlined
      class="new-nominator__submit"
      :disabled="disabled"
      @click="submit"
    >
      Submit
    </b-button>
  </ModalWrapper>
</template>


<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import BondPartial from './partial/BondPartial.vue';
import ModalWrapper from '@/components/shared/modals/ModalWrapper.vue';
import NominatePartial from './partial/NominatePartial.vue';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import exec from '@/utils/transactionExecutor';
import { notificationTypes, showNotification } from '@/utils/notification';
import Connector from '@vue-polkadot/vue-api';

const components = {
  BondPartial,
  ModalWrapper,
  NominatePartial
};

type ApiCallType = {
  bondTx?: SubmittableExtrinsic<'promise'> | any;
  bondOwnTx?: SubmittableExtrinsic<'promise'> | any;
  controllerTx?: SubmittableExtrinsic<'promise'> | any;
  stashId: string;
  controllerId: string;
  password: string;
  amount: number;
  destination: number;
};

@Component({ components })
export default class NewStash extends Vue {
  private tx: string = '';

  private bondCallback: ApiCallType = {
    stashId: '',
    controllerId: '',
    password: '',
    amount: 0,
    destination: 0
  };

  get emptyParams(): boolean {
    return false;
    // return !this.bondCallback.params.length
  }

  get disabled(): boolean {
    return false;
  }

  private async submit() {
    const { api } = Connector.getInstance();
    const { bondCallback } = this;
    const { stashId, password, bondTx, amount, destination } = bondCallback;
    console.log([stashId, amount, destination]);
        

    try {
      showNotification('Dispatched');
      this.tx = await exec(
        stashId,
        password,
        api.tx.staking.bond,
        [stashId, amount, destination]
        );
      showNotification(this.tx, notificationTypes.success);
    } catch (e) {
      showNotification(e, notificationTypes.danger);
    }
  }
}
</script>

<style scoped>
.new-nominator__submit {
  float: right;
  margin-top: -2em;
}

.filler {
  height: 3em;
}
</style>
