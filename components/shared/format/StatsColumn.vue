<template>
  <div class="level-item has-text-centered">
    <div>
      <p class="title">{{ value }}</p>
      <p class="heading">
        {{ $t(header) }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import { checkInvalidBalanceFilter as checkInvalidBalance } from '@/utils/formatBalance'
import ChainMixin from '~/utils/mixins/chainMixin'
@Component({
  filters: {
    checkInvalidBalance,
    round: function roundOffNumber(value, limit) {
      // `undefined` params in toLocaleString() means use host default language
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString#using_options
      return Number(value.replace(/,/g, '')).toLocaleString(undefined, {
        minimumFractionDigits: limit,
        maximumFractionDigits: limit,
      })
    },
  },
})
export default class StatsColumn extends mixins(ChainMixin) {
  @Prop({ default: 0 }) readonly value: number | string | undefined
  @Prop({ default: 'profileStats.totalBuys' }) readonly header:
    | string
    | undefined
}
</script>

<style lang="scss" scoped>
.collection {
  display: grid;
  grid-gap: 0.7rem;
  grid-template-columns: repeat(3, 1fr);
}

.title {
  font-size: 1.2rem;
}
</style>
