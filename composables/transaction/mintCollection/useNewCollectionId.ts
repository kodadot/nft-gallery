export function useNewCollectionId() {
  console.log('useNewCollectionId')
  const { apiInstance } = useApi()

  const newCollectionId = ref<number>()

  const getCollectionId = async () => {
    const api = await apiInstance.value
    const nextCollectionId = (
      await api.query.nfts.nextCollectionId()
    ).value.toNumber()
    newCollectionId.value = nextCollectionId
  }

  getCollectionId()

  // watch(data, () => {
  //   console.log('data', data)
  //   if (data.value) {
  //     const collectionEntities = data.value.collectionEntities
  //     const collectionList = unwrapSafe(collectionEntities)
  //     const existingIds = collectionList.map((v) => v.id)
  //     // get max id
  //     const newId =
  //       existingIds.length > 0
  //         ? Math.max(...existingIds) + 1
  //         : INITIAL_COLLECTION_ID

  //     console.log('newId', newId)
  //     newCollectionId.value = newId
  //   }
  // })

  return {
    newCollectionId,
  }
}
