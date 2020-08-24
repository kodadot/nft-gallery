<template>
  <div>
    <Dropdown mode="accounts" @selected="setStashId" />
    <Dropdown mode="accounts" @selected="setControllerId" />
    <BalanceInput v-model="amount" />
    <b-field label="Payment destination">
      <b-select placeholder="Select destination" v-model="destination">
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
  </div>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import { KeyringPair } from '@polkadot/keyring/types';
import Connector from '@vue-polkadot/vue-api';
import BalanceInput from '@/components/shared/BalanceInput.vue';
import { rewardDestinationOptions } from '../constants';
import Dropdown from '@/components/shared/Dropdown.vue';

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

  get callback() {
    const { api } = Connector.getInstance();
    return api.tx.staking.bond;
  }

  get options() {
    return rewardDestinationOptions;
  }

  get params() {
    const { stashId, amount, destination } = this;
    return [stashId, amount, destination];
  }

  public setStashId(account: KeyringPair) {
    this.stashId = account.address;
  }

  public setControllerId(account: KeyringPair) {
    this.stashId = account.address;
  }

// TODO: call
  @Emit('input')
  public partialBond() {
    return {
      callback: this.callback,
      params: this.params
    };
  }
}
</script>
