<template>
  <div class="arguments-wrapper">
    <b-field
      :label="$t(labelInput)"
      class="balance"
    >
      <b-input
        v-model="inputValue"
        type="number"
        step="0.001"
        min="0"
        @input="handleInput"
      />
      <div class="option">
        {{ label }}
      </div>
    </b-field>
  </div>
</template>

<script lang="ts" >
import { Component, Prop, Emit, mixins } from 'nuxt-property-decorator'
import { units as defaultUnits } from '@/params/constants'
import { Unit } from '@/params/types'
import { Debounce } from 'vue-debounce-decorator'
import ChainMixin from '@/utils/mixins/chainMixin'

@Component
export default class ReadOnlyBalanceInput extends mixins(ChainMixin) {
  @Prop({ type: [Number, String], default: 0 }) value!: number;
  protected units: Unit[] = defaultUnits;
  private selectedUnit = 1;
  @Prop({ default: 'USD' }) public label!: string;
  @Prop({ default: 'balance' }) public labelInput!: string;

  get inputValue(): number {
    return this.value
  }

  set inputValue(value: number) {
    this.handleInput(value)
  }

  formatSelectedValue(value: number): number {
    return value * 10 ** this.decimals * this.selectedUnit
  }

  protected mapper(unit: Unit) {
    if (unit.name === '-') {
      return { ...unit, name: this.unit }
    }
    return unit
  }

  public mounted() {
    this.units = defaultUnits.map(this.mapper)
  }

  @Debounce(200)
  @Emit('input')
  public handleInput(value: number) {
    return value
  }
}
</script>

<style scoped lang="scss">
@import "@/styles/variables";
.option {
  border: 1px solid #fff;
  display: flex;
  align-items: center;
  padding: 0rem 2.3rem;
}
</style>
