<template>
  <div>
    <!-- Sales stats goes brrrrrr -->
    <div class="card">
      <div class="content">
        <History :events="events" />
      </div>
    </div>
    {{ events }}
  </div>
</template>

<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'
import { NFT } from '@/components/rmrk/service/scheme'
import nftListSoldByIssuer from '@/queries/nftListSoldByIssuer.graphql'

@Component({
  components: {
    History: () => import('@/components/rmrk/Gallery/History.vue'),
  }
})
export default class  extends Vue {
  protected first = 50
  protected currentValue = 1
  protected nfts: NFT[] = []

  get offset() {
    return this.currentValue * this.first - this.first
  }

  async asyncData({ app, params }) {
    const res = await app.apolloProvider.defaultClient.query({
      query: nftListSoldByIssuer,
      variables: {
        account: params.id,
        first: 50,
        offset: 1,
      },
    })

    const total = res.data.nFTEntities.totalCount
    const nfts = res.data.nFTEntities.nodes
    const events = res.data.nFTEntities.nodes.flatMap((nft: { events: any }) => nft.events)

    return { total, nfts, events }
  }

  public async created() {
    console.log(this.$route.params.id)
  }
}
</script>
