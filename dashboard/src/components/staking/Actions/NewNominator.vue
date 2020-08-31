<template>
  <ModalWrapper icon="plus" label="Nominator" type="is-primary">
    <b-steps v-model="activeStep" animated rounded :has-navigation="true">
      <b-step-item step="1" label="Bond">
        <BondPartial v-model="bondCallback" />
      </b-step-item>

      <b-step-item step="2" label="Nominate">
        <NominatePartial
          :targetValidatorIds="targetValidatorIds"
          :nominating="[]"
          v-model="nominated"
        />
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
import exec from '@/utils/transactionExecutor';
import { notificationTypes,  showNotification } from '@/utils/notification';
import { SubmittableExtrinsic } from '@polkadot/api/types';

const components = {
  BondPartial,
  ModalWrapper,
  NominatePartial
};

type ApiCallType = {
  bondTx?: SubmittableExtrinsic<'promise'> | any,
  bondOwnTx?: SubmittableExtrinsic<'promise'> | any,
  controllerTx?: SubmittableExtrinsic<'promise'> | any,
  stashId: string,
  controllerId: string,
  password: string
};

@Component({ components })
export default class NewNominator extends Vue {
  @Prop() private targetValidatorIds!: string[];

  private tx: string = '';
  private activeStep: number = 0;
  private bondCallback: ApiCallType = {
    stashId: '',
    controllerId: '',
    password: ''
  };
  private nominated: string[] = [];

  get disabled(): boolean {
    return this.activeStep !== 1;
  }

  get emptyParams(): boolean {
    return false;
    // return !this.bondCallback.params.length
  }

  get nominateTx(): SubmittableExtrinsic<'promise'> {
    const { api } = Connector.getInstance();
    return api.tx.staking.nominate(this.nominated);
  }

  get batchMethods(): any[] {
    const { nominateTx, bondCallback } = this;
    const { stashId, bondTx, bondOwnTx, controllerTx } = bondCallback;
    if (bondCallback.stashId === bondCallback.controllerId) {
      return [bondTx(), nominateTx]
    }

    return [bondOwnTx(), nominateTx, controllerTx()]
  }

  private async submit()  {
    const { api } = Connector.getInstance();

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
}
</script>

<style scoped>
.new-nominator__submit {
  float: right;
  margin-top: -2em;
}
</style>
