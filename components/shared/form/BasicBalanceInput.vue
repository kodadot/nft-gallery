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
      :placeholder="placeholder" />
    <p class="control">
      <span class="button is-static">{{ unit }}</span>
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
import { Debounce } from 'vue-debounce-decorator'
import { balanceFrom, simpleDivision } from '@/utils/balance'

@Component
export default class BasicBalanceInput extends Vue {
  // Dev: make vValue required
  @VModel() vValue!: string
  @Prop({ type: String, default: '-' }) unit!: string
  @Prop({ type: Number, default: 12 }) public decimals!: number

  @Prop({ type: Number, default: 0 }) public min!: number
  @Prop({ type: Number, default: Number.MAX_SAFE_INTEGER }) public max!: number
  @Prop({ default: 0.01 }) public step!: number

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

  @Debounce(200)
  @Emit('input')
  public handleInput(value: number | string): string {
    return balanceFrom(value, this.decimals)
  }

  public focusInput(): void {
    this.balance?.focus()
  }

  // You vs the girl they told you not to worry about
  public checkValidity() {
    return this.balance.checkHtml5Validity()
  }
}
</script>
