export default function useSearchNfts({ search, first = 10 }) {
  const { client } = usePrefix()
  const queryPrefix = client.value === 'ksm' ? 'chain-ksm' : client.value
  const { data } = useGraphql({
    queryPrefix,
    queryName: 'nftListWithSearch',
    variables: {
      first,
      search,
    },
  })

  return {
    data,
  }
}
