export function useNewCollectionId() {
  const { apiInstance } = useApi()
  const newCollectionId = ref<number>()

  const getCollectionId = async () => {
    const api = await apiInstance.value
    const nextCollectionId = (
      await api.query.nfts.nextCollectionId()
    ).value.toNumber()
    newCollectionId.value = nextCollectionId
  }

  getCollectionId().catch((e) => {
    console.error('Error:', e)
  })

  return {
    newCollectionId,
  }
}
