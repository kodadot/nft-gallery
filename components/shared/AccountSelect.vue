<template>
  <b-field :label="label">
    <b-select v-model="account" placeholder="Select account" expanded>
      <option disabled selected value="">--</option>
      <option
        v-for="option in options"
        :key="option.address"
        :value="option.address">
        <b v-if="option.meta.name">{{ option.meta.name }} :</b>
        {{ option.address | shortAddress(10, -10) }}
      </option>
    </b-select>
  </b-field>
</template>

<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import WithKeyring, { KeyringAccount } from '@/utils/WithKeyring'

@Component({
  components: {},
})
export default class AccountSelect extends mixins(WithKeyring) {
  @Prop({ default: '' }) public value!: string | KeyringAccount
  @Prop() public asKeyring!: boolean
  @Prop({ default: 'Account' }) public label!: boolean

  get options() {
    return this.allAcctounts()
  }

  get account(): string {
    return typeof this.value === 'string' ? this.value : this.value.address
  }

  set account(accountValue: string) {
    this.$consola.log('this._account', accountValue)
    if (this.asKeyring) {
      this.$emit('input', this.getPair(accountValue))
    } else {
      this.$emit('input', accountValue)
    }
  }
}
</script>
