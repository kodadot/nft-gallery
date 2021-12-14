<template>
  <div>
    <!-- Sales stats goes brrrrrr -->
    <!-- {{ nftSales }} -->
  </div>
</template>

<script lang="ts" >
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import { fetchNFTMetadata, getSanitizer } from '@/components/rmrk/utils'
import nftListSoldByIssuer from '@/queries/nftListSoldByIssuer.graphql'

@Component({})
export default class  extends Vue {
  protected first = 50
  protected currentValue = 1
  // private nfts: NFT[] = []

  get offset() {
    return this.currentValue * this.first - this.first
  }

  async asyncData({ app, params }) {
    const nfts = await app.apolloProvider.defaultClient.query({
      query: nftListSoldByIssuer,
      variables: {
        account: params.id,
        first: 50,
        offset: 1,
      },
    })

    if (nfts?.length) {
      const meta = await fetchNFTMetadata(nfts)
      console.log(meta)
      // this.firstNFTData = {
      //   ...meta
      // }
    }
    return { nfts }
  }

  public created() {
    console.log('yeet')
    console.log(this.$route.params.id)
  }

}
</script>
