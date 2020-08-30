<template>
  <div>
    <Dropdown mode="accounts" @selected="setStashId" />
    <Dropdown mode="accounts" @selected="setControllerId" />
    <BalanceInput v-model="amount"/>
    <b-field label="Payment destination">
      <b-select placeholder="Select destination" v-model="destination" >
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
      <b-input v-model="password" type="password" password-reveal> </b-input>
    </b-field>
    <b-button @click="next">Next</b-button>
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import { KeyringPair } from '@polkadot/keyring/types';
import Connector from '@vue-polkadot/vue-api';
import BalanceInput from '@/components/shared/BalanceInput.vue';
import { rewardDestinationOptions } from '../constants';
import Dropdown from '@/components/shared/Dropdown.vue';
import { SubmittableExtrinsic } from '@polkadot/api/types';

const components = {
  BalanceInput,
  Dropdown
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

  private callback(...params: [string, number, number]): SubmittableExtrinsic<'promise'> {
    const { api } = Connector.getInstance();
    return api.tx.staking.bond(...params);
  }

  get options() {
    return rewardDestinationOptions;
  }

  private params(account: string): [string, number, number] {
    const { amount, destination } = this;
    return [account, amount, destination];
  }

  public setStashId(account: KeyringPair) {
    this.stashId = account.address;
  }

  public setControllerId(account: KeyringPair) {
    this.controllerId = account.address;
  }

  public next() {
    this.partialBond();
  }
// TODO: call
  @Emit('input')
  public partialBond() {
    const { callback, controllerId, stashId, password, params } = this;
    const { api } = Connector.getInstance();

    return {
      bondTx: callback(...params(controllerId)),
      bondOwnTx: callback(...params(stashId)),
      controllerTx: api.tx.staking.setController(controllerId),
      controllerId,
      stashId,
      password
    };
  }
}
</script>
