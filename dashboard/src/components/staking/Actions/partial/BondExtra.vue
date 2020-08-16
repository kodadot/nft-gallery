<template>
  <ModalWrapper icon="plus" label="Bond more funds">
    <b-field label="StashId">
      <b-input placeholder="StashId" v-model="stashId" disabled />
    </b-field>
    <b-field label="password 🤫 magic spell" class="password-wrapper">
      <b-input v-model="password" type="password" password-reveal> </b-input>
    </b-field>
    <BalanceInput v-model="value" />
    <!-- <TxButton
      @processed="handleProcessed"
      :callback="callback"
      :params="params"
      :account="stashId"
      :password="password"
    /> -->
  </ModalWrapper>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import ModalWrapper from '@/components/shared/modals/ModalWrapper.vue';
import BalanceInput from '@/components/shared/BalanceInput.vue';
// import TxButton from '@/components/shared/TxButton.vue';
import Connector from '@vue-polkadot/vue-api';

const components = {
  ModalWrapper,
  BalanceInput,
  // TxButton
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

  private handleProcessed(status: any | Error) {}
}
</script>
