<template>
<div>
  <div class="columns">
  <div
    class="column"
    v-for="nft in nfts"
    :key="nft.id"
  >
    <GalleryCard :id="nft.id" :name="nft.name" :type="type" :link="link" :metadata="nft.metadata" />
  </div>
</div>
</div>
</template>

<script lang="ts" >
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import shouldUpdate from '@/utils/shouldUpdate'
import nftSimpleListByAccount from '@/queries/nftSimpleListByAccount.graphql'

const components = {
  GalleryCard: () => import('@/components/rmrk/Gallery/GalleryCard.vue')
}

type NftSimpleView = {
  id: string;
  name: string;
  metadata: string;
}

@Component({ components })
export default class SpotlightDetail extends Vue {
  @Prop({ default: 'nftDetail' }) public type!: string;
  @Prop({ default: 'rmrk/detail' }) public link!: string;
  @Prop(String) public account!: string;
  protected nfts: NftSimpleView[] = [];
  protected isLoading = true;


  protected async fetchNFT(account: string) {
    const nfts = await this.$apollo.query({
      query: nftSimpleListByAccount,
      variables: {
        account,
        first: 4
      },
      fetchPolicy: 'network-only'
    })

    const {
      data: { nFTEntities }
    } = nfts

    this.nfts = nFTEntities?.nodes || []
  }

  @Watch('account', { immediate: true })
  watchAccount(val: string, oldVal: string) {
    if (shouldUpdate(val, oldVal)) {
      this.fetchNFT(val)
    }
  }
}
</script>
