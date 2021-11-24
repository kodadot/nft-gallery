<template>
  <Base :nfts="nfts" />
</template>

<script lang="ts" >
import { Component, Vue } from 'nuxt-property-decorator'
import Base from '@/components/metaverse/Base.vue'
import nftListByIssuer from '@/queries/nftListByIssuer.graphql'
import { notificationTypes, showNotification } from '~/utils/notification';
import { getMany, update } from 'idb-keyval';
import { fetchNFTMetadata, getSanitizer } from '~/components/rmrk/utils';
import { NFT } from '~/components/rmrk/service/scheme';

@Component({
  components: {
    Base
  }
})

export default class CollectionMeta extends Vue {
  protected id = '';
  private nfts: NFT[] = [];

  public async mounted() {
    await this.fetchProfile()
  }

  public checkId() {
    if (this.$route.params.id) {
      this.id = this.$route.params.id
    }
  }

  protected async fetchProfile() {
    this.checkId()

    try {
      this.fetchFirstGalleryPage()
    } catch (e) {
      showNotification(`${e}`, notificationTypes.danger)
      console.warn(e)
    }
    // this.isLoading = false;

  }

    public async fetchFirstGalleryPage() {
    const nfts = this.$apollo.query({
      query: nftListByIssuer,
      variables: {
        first: 62,
        offset: 0,
        account: this.id,
      }
    })

    const {
      data: { nFTEntities: { nodes: nftList } }
    } = await nfts

    this.nfts = nftList

    const storedPromise = getMany(
      nftList.map(({ metadata }: any) => metadata)
    )

    const storedMetadata = await storedPromise

    storedMetadata.forEach(async (m, i) => {
      if (!m) {
        try {
          const meta = await fetchNFTMetadata(nftList[i])
          Vue.set(this.nfts, i, {
            ...this.nfts[i],
            ...meta,
            image: getSanitizer(meta.image || '')(meta.image || '')
          })
          update(nftList[i].metadata, () => meta)
        } catch (e) {
          console.warn('[ERR] unable to get metadata')
        }
      }
    })


  }

}
</script>
