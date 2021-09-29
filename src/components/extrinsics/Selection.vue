<template>
<div>
<b-field :label="label">
    <b-select
    v-model="selected"
    :placeholder="label"
    expanded
    >
      <option v-for="acc in modeAllAccounts"
        v-bind:key="acc.address"
        :value="acc.address"
      >{{ acc.meta.name }} - {{ acc.address }}
      </option>
      <option v-for="acc in modeAccountsExternal"
        v-bind:key="acc.address"
        :value="acc.address"
      >{{ acc.meta.name }} - {{ acc.address }}
      </option>
    </b-select>
  </b-field>
  <Balance :account="selectedAccount"/>
</div>
</template>

<script lang="ts">
import { Prop, Emit } from 'vue-property-decorator'
import WithKeyring from '@/utils/WithKeyring'
import Component from 'vue-class-component'
import Balance from './Balance.vue'
import Vue, { VueConstructor } from 'vue'

@Component({
  components: {
    Balance,
  },
})
class Selection extends WithKeyring {
  @Prop({ default: 'all' }) public mode!: string;

  private label = 'To Contacts';
  private selectedAccount = '';

  get accounts() {
    return this.keyringAccounts.filter((acc) => !acc.meta.isTesting)
  }

  get modeAllAccounts() {
    return this.mode === 'all' && this.accounts
  }

  get modeAccountsExternal () {
    return this.mode === 'accounts' && this.keyringAccounts.filter((acc) => !acc.meta.isTesting && !acc.meta.isExternal)
  }

  get selected() {
    return this.selectedAccount
  }

  set selected(address: string) {
    console.log('selected', address)
    this.selectedAccount = address
    this.onSelectedAccount(address)
  }

  @Emit('selected')
  public onSelectedAccount(address: string) {
    return this.getPair(address)
  }

  public mounted(): void {
    this.gotKeys(this.mode)
  }

  private gotKeys(mode: string): void {
    if (mode === 'accounts') {
      this.label = 'From Accounts'
    }
  }
}

// Explicit casting because it would shout in other components
export default (Selection as VueConstructor<Vue>)
</script>
