export const getNftCount = async (where: Record<string, any>) => {
  const { urlPrefix } = usePrefix()

  const response = await useAsyncGraphql<{ count: { totalCount: number } }>({
    query: 'countOfNfts',
    variables: {
      where,
      denyList: getDenyList(urlPrefix.value),
    },
  })

  return response.data.value.count.totalCount
}
