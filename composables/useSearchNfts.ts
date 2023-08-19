export default function useSearchNfts({
  search,
  first = 10,
  prefix = '',
  orderBy = '',
}) {
  const { client } = usePrefix()
  const chainPrefix = prefix || client.value
  const queryPrefix = {
    ksm: 'chain-ksm',
    rmrk: 'chain-rmrk',
  }

  const { data } = useGraphql({
    queryPrefix: queryPrefix[chainPrefix] || client.value,
    clientName: chainPrefix,
    queryName: 'nftListWithSearch',
    variables: {
      first,
      search,
      orderBy,
    },
    options: {
      fetchPolicy: 'cache-first',
    },
  })

  return {
    data,
  }
}
