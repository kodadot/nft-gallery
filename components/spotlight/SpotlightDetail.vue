<template>
  <div>
    <div class="columns">
      <div v-for="nft in nfts" :key="nft.id" class="column">
        <GalleryCard :id="nft.id" :name="nft.name" :metadata="nft.metadata" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, mixins, Watch } from 'nuxt-property-decorator'
import shouldUpdate from '@/utils/shouldUpdate'
import PrefixMixin from '@/utils/mixins/prefixMixin'
import nftSimpleListByAccount from '@/queries/nftSimpleListByAccount.graphql'

const components = {
  GalleryCard: () => import('@/components/rmrk/Gallery/GalleryCard.vue'),
}

type NftSimpleView = {
  id: string
  name: string
  metadata: string
}

@Component({ components })
export default class SpotlightDetail extends mixins(PrefixMixin) {
  @Prop(String) public account!: string
  protected nfts: NftSimpleView[] = []
  protected isLoading = true

  protected async fetchNFT(account: string) {
    const nfts = await this.$apollo.query({
      query: nftSimpleListByAccount,
      client: 'rmrk',
      variables: {
        account,
        first: 4,
      },
      fetchPolicy: 'network-only',
    })

    const {
      data: { nFTEntities },
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
