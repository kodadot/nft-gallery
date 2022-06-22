<template>
  <div class="level my-4 collection is-align-items-center">
    <div class="level-item has-text-centered">
      <div>
        <p class="title">{{ statsResponse.buys.totalCount }}</p>
        <p class="heading">
          {{ $t('statsOverview.buys') }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Attribute, emptyArray, emptyObject } from '@kodadot1/minimark'
import { Component, Emit, mixins, Prop, Vue } from 'nuxt-property-decorator'
import { Offer, StatsResponse } from './types'
/// importing urlPrefix
import PrefixMixin from '~/utils/mixins/prefixMixin'
import statsForBsx from '~/queries/subsquid/bsx/statsForBsx.graphql'

const components = {
  Identity: () => import('@/components/shared/format/Identity.vue'),
  Money: () => import('@/components/shared/format/Money.vue'),
}

@Component({ components })
export default class BsxStats extends mixins(PrefixMixin) {
  @Prop({ type: Object, default: () => emptyObject<StatsResponse>() })
  public statsResponse!: StatsResponse
  fetch() {
    this.getOfferStats()
  }
  /// stats for bsx function
  protected async getOfferStats() {
    const response = await this.$apollo.query<StatsResponse>({
      client: this.urlPrefix,
      query: statsForBsx,
    })
    this.statsResponse = response.data
    console.log(this.statsResponse)
  }
}
</script>
