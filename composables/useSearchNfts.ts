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

  const { data, refetch, loading } = useGraphql({
    queryPrefix: client.value,
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
