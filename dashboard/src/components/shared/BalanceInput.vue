<template>
  <div class="arguments-wrapper">
    <b-field :label="$t('balance')" class="balance">
      <b-input v-model="value" @input="handleInput" type="number" step="0.001" min="0"/>
      <p class="control balance">
        <b-select v-model="selectedUnit" @input="handleInput">
          <option v-for="u in units" v-bind:key="u.value" v-bind:value="u.value">
            {{ u.name }}
          </option>
        </b-select>
      </p>
    </b-field>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch, Emit } from 'vue-property-decorator';
import Balance from '@/params/components/Balance.vue';
import { units as defaultUnits } from '@/params/constants';
import { Unit } from '@/params/types';
import shouldUpdate from '@/utils/shouldUpdate';
import { Debounce } from 'vue-debounce-decorator';

const components = { Balance }

type BalanceType = {
  balance: number;
}

@Component({ components })
export default class BalanceInput extends Vue {
  private value: number = 0;
  protected units: Unit[] = defaultUnits;
  private selectedUnit: number = 1;


  get chainProperties() {
    return this.$store.getters.getChainProperties;
  }

  get decimals(): number {  
    return this.chainProperties.tokenDecimals
  }

  get unit(): string {  
    return this.chainProperties.tokenSymbol
  }

  get calculatedBalance() {
    return this.value * (10**this.decimals) * this.selectedUnit
  }

  protected mapper(unit: Unit) {
    if (unit.name === '-') {
      return { ...unit, name: this.unit }
    }
    return unit
  }

  public mounted() {
    this.units = defaultUnits.map(this.mapper);
  }

  // @Watch('$store.getters.getChainProperties.tokenSymbol')
  // protected updateUnit(val: string, oldVal: string) {
  //   console.log('@Watch(unit)', val, oldVal)
  //   if (shouldUpdate(val, oldVal)) {
  //     this.units = defaultUnits.map(u => {
  //       if (u.name === '-') {
  //         return { ...u, name: val }
  //       }
  //       return u
  //     })
  //   }
  // }
  
  @Debounce(200)
  @Emit('input')
  public handleInput() {
    return this.calculatedBalance;
  }
}
</script>
