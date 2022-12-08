<template>
  <div class="arguments-wrapper">
    <b-field
      :label="$t(label)"
      class="balance"
      :type="checkZeroFailed ? 'is-danger' : ''">
      <div class="field-body">
        <div class="field has-addons">
          <b-input
            ref="balance"
            v-model="inputValue"
            :required="required"
            type="number"
            :step="step"
            :min="minWithUnit"
            :max="maxWithUnit"
            :expanded="expanded"
            data-testid="balance-input"
            @input="handleInput" />
          <p class="control balance">
            <b-select
              :value="selectedUnit"
              :disabled="!calculate"
              data-testid="balance-input-select"
              @input="handleUnitChange">
              <option v-for="u in units" :key="u.value" :value="u.value">
                {{ u.name }}
              </option>
            </b-select>
          </p>
        </div>
      </div>
      <p v-if="checkZeroFailed" class="help is-danger">
        {{ $t('tooltip.needToSetValidPrice') }}
      </p></b-field
    >
  </div>
</template>

<script lang="ts">
import {
  Component,
  Emit,
  Prop,
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
  @Prop({ type: Number, default: 0 }) value!: number
  @Prop({ default: 'amount' }) public label!: string
  @Prop({ default: true }) public calculate!: boolean
  @Prop(Boolean) public expanded!: boolean
  @Prop({ default: 0.001 }) public step!: number
  @Prop(Number) public min!: number
  @Prop({ type: Number, default: Number.MAX_SAFE_INTEGER }) public max!: number
  @Prop({ type: Boolean, default: false }) public required!: boolean
  @Prop({ type: Boolean, default: false }) public hasToLargerThanZero!: boolean
  protected checkZeroFailed = false
  protected units: Unit[] = defaultUnits
  private selectedUnit = 1
  private internalValue = this.value || 0

  get minWithUnit(): number {
    return this.min / this.selectedUnit
  }

  get maxWithUnit(): number {
    return this.max / this.selectedUnit
  }

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
    this.internalValue = this.value
  }

  @Debounce(200)
  @Emit('input')
  public handleInput(value: number) {
    this.internalValue = value
    const valueInBaseUnit = this.internalValue * this.selectedUnit
    return this.calculate
      ? this.formatSelectedValue(valueInBaseUnit)
      : valueInBaseUnit
  }

  handleUnitChange(unit) {
    const valueInBaseUnit = this.internalValue * this.selectedUnit
    this.internalValue = valueInBaseUnit ? valueInBaseUnit / unit : 0
    this.selectedUnit = unit
    this.balance.focus()
  }

  public checkValidity() {
    const valueEqualZero = this.inputValue.toString() === '0'
    this.checkZeroFailed =
      this.hasToLargerThanZero && valueEqualZero ? true : false
    const balanceInputValid = this.balance.checkHtml5Validity()
    return balanceInputValid && !this.checkZeroFailed
  }
}
</script>
