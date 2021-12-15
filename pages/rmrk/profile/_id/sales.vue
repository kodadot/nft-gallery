<template>
  <div>
    <!-- Sales stats goes brrrrrr -->
    <div class="card-content">
      <div class="content">
        <b-table :data="nfts" :columns="columns" hoverable></b-table>
      </div>
    </div>
    {{ nfts }}
  </div>
</template>

<script lang="ts" >
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import { fetchNFTMetadata, getSanitizer } from '@/components/rmrk/utils'
import { NFT, NFTMetadata, MintNFT, getNftId } from '@/components/rmrk/service/scheme'
import nftListSoldByIssuer from '@/queries/nftListSoldByIssuer.graphql'


@Component({})
export default class  extends Vue {
  protected first = 50
  protected currentValue = 1
  protected nfts: NFT[] = []
  protected columns = [
    {
      field: 'name',
      label: 'Name',
    },
    {
      field: 'currentOwner',
      label: 'Owner',
    },
    {
      field: 'price',
      label: 'Price',
      numeric: true
    },
    {
      field: 'gender',
      label: 'Gender',
    }
  ]

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

    if (nfts?.length) {
      const meta = await fetchNFTMetadata(nfts)
      console.log('meta:')
      console.log(meta)
      // this.firstNFTData = {
      //   ...meta
      // }
    }
    return { total, nfts }
  }

  public async created() {
    console.log('yeet')
    console.log(this.$route.params.id)
    // if (nfts)
  }

}
</script>
