<template>
  <nuxt-link :to="`/${urlPrefix}/collection/${collection.id}`">
    <div
      class="top-collections-item py-2 is-flex is-align-items-center is-justify-content-space-between is-clickable">
      <div class="is-flex is-align-items-center is-flex-grow-1">
        <div class="p-4 has-text-weight-bold">
          {{ index }}
        </div>
        <div>
          <BasicImage
            custom-class="is-48x48 image-outline"
            rounded
            :src="collection.image || '/placeholder.webp'" />
        </div>
        <div class="px-2 is-flex is-flex-grow-1 is-flex-direction-column">
          <div class="has-text-weight-bold">
            {{ collection.name | truncateStr(12) }}
          </div>
          <div class="is-flex is-justify-content-space-between">
            <div>
              <div v-if="collection.floorPrice">
                Floor:
                <CommonTokenMoney :value="collection.floorPrice" inline />
              </div>
              <div v-else>---</div>
            </div>
            <div class="is-uppercase has-text-grey">
              {{ urlPrefix }}
            </div>
          </div>
        </div>
      </div>
      <div class="is-pulled-right has-text-right px-2">
        <div class="is-flex">
          <div>
            <div>
              <CommonTokenMoney :value="volume" inline />
            </div>
            <div>
              <BasicMoney :value="usdValue" inline :unit="'USD'" />
            </div>
          </div>
          <div
            class="is-flex is-justify-content-center is-align-items-center pl-2 is-size-5">
            <p :class="color">
              {{ diffPercent.str }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </nuxt-link>
</template>

<script lang="ts">
import { RowSeries } from '@/components/series/types'
import { mixins } from 'nuxt-property-decorator'
import { Component, Prop } from 'vue-property-decorator'
import { calculateUsdFromKsm } from '~~/utils/calculation'
import PrefixMixin from '~~/utils/mixins/prefixMixin'
@Component({
  components: {
    BasicImage: defineAsyncComponent(
      () => import('@/components/shared/view/BasicImage.vue')
    ),
    CommonTokenMoney: defineAsyncComponent(
      () => import('@/components/shared/CommonTokenMoney.vue')
    ),
    BasicMoney: defineAsyncComponent(
      () => import('@/components/shared/format/BasicMoney.vue')
    ),
  },
})
export default class TopCollectionsItem extends mixins(PrefixMixin) {
  @Prop() collection!: RowSeries
  @Prop() index!: number
  @Prop({ default: 'Month' }) timeRange!: 'Month' | 'Week' | 'Day'

  protected mounted() {
    this.$store.dispatch('fiat/fetchFiatPrice')
  }

  get volume() {
    switch (this.timeRange) {
      case 'Month':
        return Number(this.collection.monthlyVolume)
      case 'Week':
        return Number(this.collection.weeklyVolume)
      case 'Day':
        return Number(this.collection.dailyVolume)
    }
  }
  get previousVolume() {
    switch (this.timeRange) {
      case 'Month':
        return Number(this.collection.monthlyrangeVolume)
      case 'Week':
        return Number(this.collection.weeklyrangeVolume)
      case 'Day':
        return Number(this.collection.dailyrangeVolume)
    }
  }
  get diffPercent(): { value: number; str: string } {
    const value = (this.volume / this.previousVolume - 1) * 100 || 0
    const sign = value < 0 ? '-' : '+'
    return { value, str: `${sign} ${Math.abs(value).toFixed(2)}%` }
  }

  get color() {
    return this.diffPercent.value < 0 ? 'red' : 'green'
  }

  get usdValue() {
    return calculateUsdFromKsm(
      this.volume,
      this.$store.getters['fiat/getCurrentKSMValue']
    )
  }
}
</script>
<style scoped>
.green {
  color: rgb(0, 188, 0);
}

.red {
  color: red;
}
</style>
