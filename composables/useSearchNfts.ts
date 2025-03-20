import type { ResultOf } from 'gql.tada'
import nftListWithSearch from '~/queries/subsquid/general/nftListWithSearch'

export default function useSearchNfts({
  search,
  first = 10,
  offset = 0,
  prefix = '',
  orderBy = 'blockNumber_DESC',
  denyList = [] as string[],
  immediate = true,
}) {
  const { client } = usePrefix()
  const chainPrefix = prefix || client.value

  const { $apolloClient, $consola } = useNuxtApp()
  const data = ref<ResultOf<typeof nftListWithSearch>>()
  const loading = ref(true)

  const fetchSearch = () => {
    $apolloClient.query({
      query: nftListWithSearch,
      variables: {
        first,
        search,
        orderBy: [orderBy],
        denyList,
        offset,
      },
      context: {
        endpoint: chainPrefix,
      },
    }).then((res) => {
      data.value = res.data
      loading.value = false
    }).catch(() => {
      $consola.error('Error fetching search nfts')
      loading.value = false
    })
  }

  if (immediate) {
    fetchSearch()
  }

  return {
    data,
    refetch: fetchSearch,
    loading,
  }
}
