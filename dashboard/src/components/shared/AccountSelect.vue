<template>
     <b-field :label="label" >
      <b-select placeholder="Select account" v-model="account" expanded>
        <option
          v-for="option in options"
          :value="option.address"
          :key="option.address"
        >
          <b v-if="option.meta.name">{{ option.meta.name }} :</b> {{ option.address | shortAddress(10, -10) }}
        </option>
      </b-select>
    </b-field>
</template>
<script lang="ts" >
import { Component, Prop, Vue, Watch, Mixins, Emit } from 'vue-property-decorator';
import WithKeyring, { KeyringAccount } from '@/utils/WithKeyring';
import { KeyringPair } from '@polkadot/keyring/types';
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types';

@Component
export default class AccountSelect extends Mixins(WithKeyring) {
  @Prop() public value!: string | KeyringAccount;
  @Prop() public asKeyring!: boolean;
  @Prop({ default: 'Account' }) public label!: boolean;


  get options() {
    return this.allAcctounts();
  }

  get account(): string {
    return typeof this.value === 'string' ? this.value : this.value.address;
  }

  set account(accountValue: string) {
    console.log('this._account', accountValue)
    if (this.asKeyring) {
      this.$emit('input', this.getPair(accountValue))
    } else {
      this.$emit('input', accountValue)
    }
    
  }

}
</script>
