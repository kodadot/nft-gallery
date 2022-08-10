<template>
  <div :class="['money', { 'is-inline-block': inline }]">
    <div>
      {{ value | checkInvalidBalance | formatBalance(decimals) }}{{ realUnit }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { checkInvalidBalanceFilter } from '@/utils/formatBalance'

@Component({
  filters: {
    checkInvalidBalanceFilter,
  },
})
export default class BasicMoney extends Vue {
  @Prop({ default: '0' }) readonly value!: number | string | undefined
  @Prop({ type: Number, default: 12 }) readonly decimals!: number
  @Prop({ type: String, default: 'KSM' }) readonly unit!: string

  // MISC
  @Prop(Boolean) readonly inline!: boolean
  @Prop(Boolean) readonly hideUnit!: boolean

  // TODO Decimals not properly implemented

  get realUnit(): undefined | string {
    return this.hideUnit ? '' : ' ' + this.unit
  }
}
</script>
