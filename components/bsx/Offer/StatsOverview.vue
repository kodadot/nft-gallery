<template>
  <div>
    <div class="level my-4 collection is-align-items-center mb-5">
      <div
        v-for="key in keysObject"
        :key="key"
        class="level-item has-text-centered">
        <div>
          <p class="title">{{ returnTotalCounts(key, statsResponse) }}</p>
          <p class="heading">
            {{ $t(`statsOverview.${key}`) }}
          </p>
        </div>
      </div>
    </div>
    <div class="level my-4 collection is-align-items-center mb-5">
      <div
        v-for="data in offerStats"
        :key="data.status"
        class="level-item has-text-centered">
        <div>
          <p class="title">
            {{ `${data.totalCount} /` }}
            <CommonTokenMoney :value="data.totalPrice" inline />
          </p>
          <p class="heading has-text-weight-bold mb-5">
            {{
              `${data.status} ${$t('statsOverview.offers')} / ${$t(
                'statsOverview.values'
              )}`
            }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { OfferStats, StatsResponse } from './types'
import PrefixMixin from '~/utils/mixins/prefixMixin'
import { countOf } from '~/utils/countOf'
import statsForBsx from '~/queries/subsquid/bsx/statsForBsx.graphql'

const components = {
  Identity: () => import('@/components/identity/IdentityIndex.vue'),
  CommonTokenMoney: () => import('@/components/shared/CommonTokenMoney.vue'),
}

@Component({ components })
export default class BsxStats extends mixins(PrefixMixin) {
  public statsResponse!: StatsResponse
  protected offerStats: OfferStats[] = []
  protected keysObject: string[] = []

  fetch() {
    this.getOfferStats()
  }

  protected async getOfferStats() {
    const response = await this.$apollo.query<StatsResponse>({
      client: this.urlPrefix,
      query: statsForBsx,
    })
    this.statsResponse = response.data
    this.keysObject = Object.keys(response.data).filter(
      (key) => key !== 'offerStats'
    )
    this.offerStats = this.statsResponse.offerStats
  }
  protected returnTotalCounts(key, statsResponse) {
    if (key === 'activeWallets') {
      return countOf(statsResponse.activeWallets[0])
    } else {
      return countOf(statsResponse[key])
    }
  }
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
