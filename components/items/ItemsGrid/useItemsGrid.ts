import type { NFT } from '@/components/rmrk/service/scheme'

import resolveQueryPath from '@/utils/queryPathResolver'
import { getDenyList } from '@/utils/prefix'

type PriceRange = {
  price_gt: string
  price_gte: number
  price_lte?: number
}[]

function useSearchParams() {
  const route = useRoute()
  const { accountId } = useAuth()

  const searchParams = computed(() => {
    // construct keywords
    const keywords = route.query.search?.length
      ? [{ name_containsInsensitive: route.query.search }]
      : []

    // construct price range
    const price: PriceRange = []
    if (route.query.listed) {
      const minPrice = route.query.min ?? 0

      if (route.query.max) {
        price.push({
          price_gt: '0',
          price_gte: Number(minPrice),
          price_lte: Number(route.query.max),
        })
      } else {
        price.push({
          price_gt: '0',
          price_gte: Number(minPrice),
        })
      }
    }

    // construct owner
    const owner =
      route.query.owned && accountId.value
        ? [{ currentOwner_eq: accountId.value }]
        : []

    // on collection page
    const collectionId =
      route.name === 'prefix-collection-id'
        ? [{ collection: { id_eq: route.params.id } }]
        : []

    // on user page. fetch by creator
    const userId =
      route.name === 'prefix-u-id' ? [{ issuer_eq: route.params.id }] : []

    return [...keywords, ...price, ...owner, ...collectionId, ...userId]
  })

  return {
    searchParams,
  }
}

export function useFetchSearch() {
  const { $apollo } = useNuxtApp()
  const { client, urlPrefix } = usePrefix()
  const route = useRoute()
  const router = useRouter()

  const first = 20
  const page = ref(1)
  const nfts = ref<NFT[]>([])
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
