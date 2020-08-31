<template>
  <ModalWrapper icon="plus" label="Validator" type="is-primary">
    <b-steps v-model="activeStep" animated rounded :has-navigation="true">
      <b-step-item step="1" label="Bond">
        <BondPartial v-model="bondCallback" />
      </b-step-item>

      <b-step-item step="2" label="Keys and Commision">
        <div>
          <b-field label="Session Keys">
            <b-input placeholder="0x..." expanded v-model="keys" />
            <b-button
              @click="generateSessionKey"
              type="is-success"
              outlined
              class="staking-actions-session-key__generate"
              >Generate
            </b-button>
          </b-field>
          <b-field label="Commission">
            <b-input v-model="commission" />
          </b-field>
        </div>
      </b-step-item>

      <template slot="navigation" slot-scope="{ previous, next }">
        <b-button
          outlined
          icon-left="angle-left"
          :disabled="previous.disabled"
          @click.prevent="previous.action"
        >
        </b-button>
        <b-button
          outlined
          icon-right="angle-right"
          :disabled="next.disabled || emptyParams"
          @click.prevent="next.action"
        >
        </b-button>
      </template>
    </b-steps>

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
import Connector from '@vue-polkadot/vue-api';
import { notificationTypes, showNotification } from '@/utils/notification';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import BN from 'bn.js';
import { BN_ZERO, BN_HUNDRED as MAX_COMM } from '@polkadot/util';
import exec from '@/utils/transactionExecutor';

const components = {
  BondPartial,
  ModalWrapper,
  NominatePartial
};

type ApiCallType = {
  bondTx: (...params: [string, number, number]) => SubmittableExtrinsic<'promise'> | any;
  bondOwnTx: (...params: [string, number, number]) => SubmittableExtrinsic<'promise'> | any;
  controllerTx: (controllerId: string) => SubmittableExtrinsic<'promise'> | any;
  stashId: string;
  controllerId: string;
  password: string;
  bondParams: [string, number, number];
  bondOwnParams: [string, number, number];
};

const EMPTY_PROOF = new Uint8Array();
const COMM_MUL = new BN(1e7);

@Component({ components })
export default class NewNominator extends Vue {
  private activeStep: number = 0;
  private tx: string = '';
  private bondCallback: ApiCallType = {
    bondTx: () => null,
    bondOwnTx: () => null,
    controllerTx: () => null,
    stashId: '',
    controllerId: '',
    password: '',
    bondParams: ['', 0, 0],
    bondOwnParams: ['', 0, 0],
  };

  private keys: string = '';
  private commission: number = 0;

  get disabled(): boolean {
    return this.activeStep !== 1;
  }

  get emptyParams(): boolean {
    return false;
    // return !this.bondCallback.params.length
  }

  get sessionTx(): SubmittableExtrinsic<'promise'> {
    const { api } = Connector.getInstance();
    return api.tx.session.setKeys(this.keys as any, EMPTY_PROOF);
  }

  get validateTx(): SubmittableExtrinsic<'promise'> {
    const { api } = Connector.getInstance();
    const commission = (new BN(this.commission) || BN_ZERO).mul(COMM_MUL);
    return api.tx.staking.validate({
      commission: commission.isZero() ? 1 : commission
    });
  }

  get batchMethods(): SubmittableExtrinsic<'promise'>[] {
    const { sessionTx, bondCallback, validateTx } = this;
    const { stashId, bondTx, bondOwnTx, controllerTx, controllerId, bondParams, bondOwnParams  } = bondCallback;
    if (bondCallback.stashId === bondCallback.controllerId) {
      return [bondTx(...bondParams), sessionTx, validateTx];
    }

    return [bondOwnTx(...bondOwnParams), sessionTx, validateTx, controllerTx(controllerId)];
  }

  private async submit() {
    const { api } = Connector.getInstance();
    const { batchMethods, bondCallback } = this;
    console.log(bondCallback.stashId,
        bondCallback.password);
  const { stashId, bondTx, bondOwnTx, controllerTx } = bondCallback;
  const { sessionTx, validateTx } = this;
    console.log(batchMethods);
    

    try {
      showNotification('Dispatched');
      const { batchMethods, bondCallback } = this;
      this.tx = await exec(
        bondCallback.stashId,
        bondCallback.password,
        api.tx.utility.batch,
        [batchMethods]
      );
      showNotification(this.tx, notificationTypes.success);
    } catch (e) {
      showNotification(e, notificationTypes.danger);
    }
  }
  private async generateSessionKey() {
    const { api } = Connector.getInstance();
    try {
      const response = await api.rpc.author.rotateKeys();
      console.log('response', response);
      this.keys = response.toString();
    } catch (e) {
      showNotification(e.message, notificationTypes.danger);
      console.warn(e);
    }
  }
}
</script>

<style scoped>
.new-nominator__submit {
  float: right;
  margin-top: -2em;
}

.staking-actions-session-key__generate {
  height: inherit;
}
</style>
