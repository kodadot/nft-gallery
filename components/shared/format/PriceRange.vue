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
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({
  components: {
    Money: () => import('@/components/shared/format/Money.vue'),
  },
})
export default class PriceRange extends Vue {
  @Prop({ default: 0 }) readonly from: number | string | undefined
  @Prop({ default: undefined }) readonly to: number | string | undefined
  @Prop(Boolean) readonly inline!: boolean
}
</script>
