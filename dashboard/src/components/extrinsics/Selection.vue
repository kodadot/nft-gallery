<template>
<div>
<b-field :label="label">
    <b-select
    v-model="selected"
    :placeholder="label"
    expanded
    >
      <option v-if="mode === 'all'"
        v-for="acc in accounts"
        v-bind:key="acc.address"
        :value="acc.address"
      >{{ acc.meta.name }} - {{ acc.address }} 
      </option>
      <option v-if="mode === 'accounts' && !acc.meta.isExternal"
        v-for="acc in accounts"
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
import { Prop, Emit } from 'vue-property-decorator';
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
  @Prop({ default: 'all' }) public mode!: string;

  private label = 'To Contacts';
  private selectedAccount: string = '';

  get accounts() {
    return this.keyringAccounts.filter((acc) => !acc.meta.isTesting);
  }

  get selected() {
    return this.selectedAccount;
  }

  set selected(address: string) {
    console.log('selected', address);
    this.selectedAccount = address;
    this.onSelectedAccount(address);
  }

  @Emit('selected')
  public onSelectedAccount(address: string) {
    return this.getPair(address);
  }


  public mounted(): void {
    this.gotKeys(this.mode);
  }

  private gotKeys(mode: string): void {
    if (mode === 'accounts') {
      this.label = 'From Accounts';
    }
  } 
}

// Explicit casting because it would shout in other components
export default (Selection as VueConstructor<Vue>);
</script>
