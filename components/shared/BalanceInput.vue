<template>
  <div class="arguments-wrapper">
    <b-field :label="$t(label)" class="balance">
      <b-input
        ref="balance"
        v-model="inputValue"
        type="number"
        :step="step"
        :min="min"
        :max="max"
        :expanded="expanded"
        @input="handleInput" />
      <p class="control balance">
        <b-select
          v-model="selectedUnit"
          :disabled="!calculate"
          @input="handleInput(internalValue)">
          <option v-for="u in units" :key="u.value" :value="u.value">
            {{ u.name }}
          </option>
        </b-select>
      </p>
    </b-field>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Emit,
  Ref,
  Watch,
  mixins,
} from 'nuxt-property-decorator'
import { units as defaultUnits } from '@/params/constants'
import { Unit } from '@/params/types'
import { Debounce } from 'vue-debounce-decorator'
import ChainMixin from '@/utils/mixins/chainMixin'

@Component
export default class BalanceInput extends mixins(ChainMixin) {
  @Prop({ type: Number, default: 0 }) value?: number
  @Prop({ default: 'balance' }) public label!: string
  @Prop({ default: true }) public calculate!: boolean
  @Prop(Boolean) public expanded!: boolean
  @Prop({ default: 0.001 }) public step!: number
  @Prop(Number) public min!: number
  @Prop(Number) public max!: number
  protected units: Unit[] = defaultUnits
  private selectedUnit = 1
  private internalValue = this.value || 0

  @Watch('value') onValueChange(newValue) {
    this.internalValue = newValue
  }

  @Ref('balance') readonly balance

  get inputValue(): number {
    return this.internalValue
  }

  set inputValue(value: number) {
    this.handleInput(value)
  }

  public focusInput(): void {
    this.balance?.focus()
  }

  formatSelectedValue(value: number): string {
    return value ? String(value * 10 ** this.decimals * this.selectedUnit) : '0'
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
    this.internalValue = value
    return this.calculate ? this.formatSelectedValue(value) : value
  }

  public checkValidity() {
    return this.balance.checkHtml5Validity()
  }
}
</script>
