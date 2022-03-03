<template>
  <div>
    <!-- Sales stats goes brrrrrr -->
    <div class="card">
      <div class="content">
        <History :events="events" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { NFT } from '@/components/rmrk/service/scheme'
import nftListSoldByIssuer from '@/queries/nftListSoldByIssuer.graphql'
import PrefixMixin from '~/utils/mixins/prefixMixin'

@Component({
  components: {
    History: () => import('@/components/rmrk/Gallery/History.vue'),
  },
  async asyncData({ app, $config, params }) {
    const res = await app?.apolloProvider?.clients[$config.prefix].query({
      query: nftListSoldByIssuer,
      variables: {
        account: params.id,
        first: 20,
        offset: 1,
      },
    })

    const total = res?.data.nFTEntities.totalCount
    const nfts = res?.data.nFTEntities.nodes
    const events = res?.data.nFTEntities.nodes.flatMap(
      (nft: { events: any }) => nft.events
    )

    return { total, nfts, events }
  },
})
export default class extends mixins(PrefixMixin) {
  protected first = 20
  protected currentValue = 1
  protected nfts: NFT[] = []

  get offset() {
    return this.currentValue * this.first - this.first
  }

  public async created() {
    console.log(this.$route.params.id)
  }
}
</script>
