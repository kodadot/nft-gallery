<template>
  <div :class="[{ 'is-inline-block': inline }]">
    {{ $t('query.priceRange.range') }} {{ $t('general.from') }}
    <Money :value="from" inline />
    <span v-if="to">
      {{ $t('general.to') }}
      <Money :value="to" inline />
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Prop, mixins } from 'nuxt-property-decorator'
import ChainMixin from '~/utils/mixins/chainMixin'

@Component({
  components: {
    Money: () => import('@/components/shared/format/Money.vue'),
  },
})
export default class PriceRange extends mixins(ChainMixin) {
  @Prop(Boolean) readonly inline!: boolean

  get from(): number | undefined {
    if (this.$route.query.min) {
      return parseFloat(this.$route.query.min.toString()) * 10 ** this.decimals
    }
    return undefined
  }

  get to(): number | undefined {
    if (this.$route.query.max) {
      return parseFloat(this.$route.query.max.toString()) * 10 ** this.decimals
    }
    return undefined
  }
}
</script>
