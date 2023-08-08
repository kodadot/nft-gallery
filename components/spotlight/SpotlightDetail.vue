<template>
  <div class="columns">
    <div v-for="nft in nfts" :key="nft.id" class="column">
      <GalleryCard :id="nft.id" :name="nft.name" :metadata="nft.metadata" />
    </div>
  </div>
</template>

<script setup lang="ts">
import nftSimpleListByAccount from '@/queries/nftSimpleListByAccount.graphql'
import GalleryCard from '@/components/rmrk/Gallery/GalleryCard.vue'

const props = defineProps<{
  account: string
}>()

const nfts = ref([])
const { $apollo } = useNuxtApp()
const { client } = usePrefix()

watch(
  () => props.account,
  async (newAccount) => {
    await fetchNFT(newAccount)
  }
)

const fetchNFT = async (account: string) => {
  const nfts = await $apollo.query({
    query: nftSimpleListByAccount,
    client: client.value,
    variables: {
      account,
      first: 4,
    },
    fetchPolicy: 'network-only',
  })

  const {
    data: { nftEntities },
  } = nfts

  nfts.value = nftEntities || []
}

// const { pending } = useLazyAsyncData('data', async () => {
//   const {
//     data: { salesFeed },
//   } = await $apollo.query({
//     query: salesFeedGql,
//     client: client.value,
//     variables: {},
//   })

//   salesFeed.forEach((nft, idx) => {
//     nft.idx = idx + 1
//     nft.image = sanitizeIpfsUrl(nft.image)
//     nft.date = parseDate(Number(nft.timestamp))
//     nft.relDate = formatDistanceToNow(Number(nft.timestamp), {
//       addSuffix: true,
//     })
//   })

//   sales.value = salesFeed
// })
</script>

<!-- <script lang="ts">
import { Component, Prop, Watch, mixins } from 'nuxt-property-decorator'
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
      data: { nftEntities },
    } = nfts

    this.nfts = nftEntities || []
  }

  @Watch('account', { immediate: true })
  watchAccount(val: string, oldVal: string) {
    if (shouldUpdate(val, oldVal)) {
      this.fetchNFT(val)
    }
  }
}
</script> -->
