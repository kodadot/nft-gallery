<template>
<div>
<b-field :label="label">
    <b-select
    v-model="selected"
    :placeholder="label"
    expanded
    >
      <option
        v-for="acc in accounts"
        v-bind:key="acc.address"
        :value="acc.address"
      >{{ acc.meta.name }} - {{ acc.address }} </option>
    </b-select>
  </b-field>
  <Balance />
</div >
</template>

<script lang="ts">
import { Prop } from 'vue-property-decorator';
import WithKeyring from '@/utils/WithKeyring';
import Component from 'vue-class-component';
import Balance from './Balance.vue';
import Vue, { VueConstructor } from 'vue';

@Component({
  components: {
    Balance,
  },
})
class Selection extends WithKeyring {
  private label = 'Accounts';
  private selectedAccount = null;

  get accounts() {
    return this.keyringAccounts.filter((acc) => !acc.meta.isTesting);
  }

  get selected() {
    return this.selectedAccount;
  }

  set selected(value) {
    console.log('selected', value);
  }
}

// Explicit casting because it would shout in other components
export default (Selection as VueConstructor<Vue>);
</script>
