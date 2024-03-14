export const subscribeToNfts = (ids: string[], onChange: (data) => void) => {
  return useSubscriptionGraphql({
    query: `nftEntities(where: {
            id_in: ${JSON.stringify(ids)}
        }) {
          id
        }`,
    onChange: ({ data: { nftEntities } }) => {
      onChange(nftEntities)
    },
  })
}
