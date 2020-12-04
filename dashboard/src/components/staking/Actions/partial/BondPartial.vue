<template>
  <div>
    <AccountSelect label="stashId" :value="stashId" @input="setStashId" />
    <AccountSelect label="controllerId" :value="controllerId" @input="setControllerId" />
    <BalanceInput :value="amount" @input="setValue" />
    <b-field label="Payment destination" class="staking-actions-bond__destination">
      <b-select placeholder="Select destination" v-model="destination" @input="setDestination" expanded>
        <option
          v-for="option in options"
          :value="option.value"
          :key="option.value"
        >
          {{ option.text }}
        </option>
      </b-select>
    </b-field>
    <b-field label="password 🤫 magic spell" class="password-wrapper">
      <b-input v-model="password" @input="setPassword" type="password" password-reveal> </b-input>
    </b-field>
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import { KeyringPair } from '@polkadot/keyring/types';
import Connector from '@vue-polkadot/vue-api';
import BalanceInput from '@/components/shared/BalanceInput.vue';
import { rewardDestinationOptions } from '../constants';
import Dropdown from '@/components/shared/Dropdown.vue';
import { SubmittableExtrinsic, AugmentedSubmittable } from '@polkadot/api/types';
import AccountSelect from '@/components/shared/AccountSelect.vue'

const components = {
  BalanceInput,
  Dropdown,
  AccountSelect
};

@Component({ components })
export default class BondPartial extends Vue {
  private value2: any;
  @Prop() public value!: any;

  private stashId: string = '';
  private controllerId: string = '';
  private amount: number = 0;
  private password: string = '';
  private destination: number = 0;

  private callback(): AugmentedSubmittable<any> {
    const { api } = Connector.getInstance();
    return api.tx.staking.bond;
  }

  get options() {
    return rewardDestinationOptions;
  }

  private params(account: string): [string, number, number] {
    const { amount, destination } = this;
    return [account, amount, destination];
  }

  public setPassword(newPassword: string) {
    this.password = newPassword;
    this.partialBond();
  }

  public setDestination(newDestination: number) {
    this.destination = newDestination;
    this.partialBond();
  }

  public setStashId(stashId: string) {
    this.stashId = stashId;
    this.partialBond();
  }

  public setControllerId(controllerId: string) {
    this.controllerId= controllerId;
    this.partialBond();
  }

  public setValue(newValue: any) {
    this.amount = newValue;
    this.partialBond();
  }


  @Emit('input')
  public partialBond() {
    const { callback, controllerId, stashId, password, params, amount, destination } = this;
    const { api } = Connector.getInstance();

    return {
      bondTx: api.tx.staking.bond,
      bondParams: params(controllerId),
      bondOwnTx: api.tx.staking.bond,
      bondOwnParams: params(stashId),
      controllerTx: api.tx.staking.setController,
      controllerId,
      stashId,
      password,
      destination,
      amount
    };
  }
}
</script>

<style scoped>
.staking-actions-bond__destination {
  margin: 1em 0 1em 1em;
}
</style>
