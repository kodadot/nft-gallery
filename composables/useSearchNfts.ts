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
  const queryPrefix = {
    ksm: 'chain-ksm',
    rmrk: 'chain-rmrk',
  }

  const { data, refetch, loading } = useGraphql({
    queryPrefix: queryPrefix[chainPrefix] || client.value,
    clientName: chainPrefix,
    queryName: 'nftListWithSearch',
    variables: {
      first,
      search,
      orderBy,
      denyList,
      offset,
    },
    options: {
      fetchPolicy: 'cache-first',
    },
    disabled: computed(() => !immediate),
  })

  return {
    data,
    refetch,
    loading,
  }
}
