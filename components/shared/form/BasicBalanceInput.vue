<template>
  <b-field :label="$t(label)">
    <b-input
      ref="balance"
      v-model="metaValue"
      type="number"
      :step="step"
      :min="min"
      :max="max"
      :disabled="disabled"
      :expanded="expanded"
      :placeholder="placeholder"
      data-testid="balance-input"
      :use-html5-validation="true"
      @blur="onBlur" />
    <p class="control">
      <span data-testid="balance-input-label" class="button is-static">{{
        unit
      }}</span>
    </p>
  </b-field>
</template>

<script lang="ts">
import {
  Component,
  Emit,
  Prop,
  Ref,
  VModel,
  Vue,
} from 'nuxt-property-decorator'

import { balanceFrom, simpleDivision } from '@/utils/balance'

@Component
export default class BasicBalanceInput extends Vue {
  // Dev: make vValue required
  @VModel() vValue!: string | number
  @Prop({ type: String, default: '-' }) unit!: string
  @Prop({ type: Number, default: 12 }) public decimals!: number

  @Prop({ type: Number, default: 0 }) public min!: number
  @Prop({ type: Number, default: Number.MAX_SAFE_INTEGER }) public max!: number
  @Prop({ default: 0.001 }) public step!: number

  // MISC
  @Prop({ type: String, default: 'amount' }) label!: string
  @Prop({ type: String, default: '1' }) placeholder!: string
  @Prop({ type: Boolean, default: false }) expanded!: boolean
  @Prop({ type: Boolean, default: false }) disabled!: boolean

  @Ref('balance') readonly balance

  get metaValue(): number {
    return simpleDivision(this.vValue, this.decimals)
  }

  set metaValue(value: number | string) {
    this.handleInput(value)
  }

  @Emit('input')
  public handleInput(value: number | string): string {
    this.checkValidity()
    try {
      return balanceFrom(value, this.decimals)
    } catch (e) {
      this.$consola.warn((e as Error).message)
      return '0'
    }
  }

  public onBlur() {
    this.checkValidity()
  }

  public focusInput(): void {
    this.balance?.focus()
  }

  public checkValidity() {
    return this.balance.checkHtml5Validity()
  }
}
</script>
