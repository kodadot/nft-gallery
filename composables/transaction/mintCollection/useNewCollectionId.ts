export function useStatemineNewCollectionId() {
  const { apiInstance } = useApi()
  const { $consola } = useNuxtApp()

  const getCollectionId = async () => {
    try {
      const api = await apiInstance.value
      const result = await api.query.nfts.nextCollectionId()

      return result.unwrap().toNumber()
    }
    catch (error) {
      $consola.error('Error getting collection id', error)
      return undefined
    }
  }

  return {
    nextCollectionId: getCollectionId,
  }
}
