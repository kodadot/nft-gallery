import type { NFT, NFTMetadata } from '@/components/rmrk/service/scheme'

import resolveQueryPath from '@/utils/queryPathResolver'
import { getDenyList } from '@/utils/prefix'
import { useSearchParams } from './utils/useSearchParams'

export type NFTWithMetadata = NFT & NFTMetadata & { meta: NFTMetadata }

export function useFetchSearch() {
  const { $apollo } = useNuxtApp()
  const { client, urlPrefix } = usePrefix()
  const route = useRoute()
  const router = useRouter()

  const first = 20
  const page = ref(1)
  const nfts = ref<NFTWithMetadata[]>([])
  const total = ref(0)

  const { searchParams } = useSearchParams()

  async function fetchSearch(page) {
    const query = await resolveQueryPath(client.value, 'nftListWithSearch')
    const result = await $apollo.query({
      query: query.default,
      client: client.value,
      variables: {
        denyList: getDenyList(urlPrefix.value),
        orderBy: route.query.sort?.length
          ? route.query.sort
          : ['blockNumber_DESC'],
        search: searchParams.value,
        priceMin: Number(route.query.min),
        priceMax: Number(route.query.max),
        first,
        offset: (page - 1) * first,
      },
    })

    // handle results
    const { nFTEntities, nftEntitiesConnection } = result.data

    total.value = nftEntitiesConnection.totalCount
    nFTEntities.forEach((nft) => {
      if (nft) {
        nfts.value.push(nft)
      }
    })
  }

  function resetSearch() {
    nfts.value = []
    page.value = 1

    fetchSearch(1)
  }

  function nextPage() {
    page.value += 1

    router.push({
      query: {
        ...route.query,
        page: `${page.value}`,
      },
    })

    fetchSearch(page.value)
  }

  onBeforeMount(() => {
    fetchSearch(page)
  })

  watch(
    [
      () => route.query.sort,
      () => route.query.search,
      () => route.query.listed,
      () => route.query.min,
      () => route.query.max,
    ],
    () => {
      resetSearch()
    }
  )

  return {
    nfts,
    total,
    nextPage,
  }
}
