<template>
  <div :class="['money', { 'is-inline-block': inline }]">
    <div>
      {{
        value |
          checkInvalidBalance |
          formatBalance(decimals, '') |
          round(round)
      }}{{ realUnit }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import {
  checkInvalidBalanceFilter as checkInvalidBalance,
  roundTo,
} from '@/utils/format/balance'

@Component({
  filters: {
    checkInvalidBalance,
    round: roundTo,
  },
})
export default class BasicMoney extends Vue {
  @Prop({ default: '0' }) readonly value!: number | string | undefined
  @Prop({ type: Number, default: 12 }) readonly decimals!: number
  @Prop({ type: String, default: 'KSM' }) readonly unit!: string
  @Prop({ type: Number, default: 4 }) readonly round!: number

  // MISC
  @Prop(Boolean) readonly inline!: boolean
  @Prop(Boolean) readonly hideUnit!: boolean
  checkInvalidBalance: string | number | undefined

  // TODO: Format not properly implemented: ref #3868

  get realUnit(): undefined | string {
    return this.hideUnit ? '' : ' ' + this.unit
  }
}
</script>
