import { CollectionWithMeta } from '../rmrk/service/scheme'
import unlockableCollectionById from '@/queries/subsquid/general/unlockableCollectionById.graphql'

export interface Drop {
  collection: CollectionWithMeta
  minted: number
  max: number
  dropStartTime: Date
}

interface DropsData {
  drops: Drop[]
  futureDrops: Drop[]
}

const futureDate = new Date()
futureDate.setDate(futureDate.getDate() * 7) // i weeks in the future

export function useDrops(collectionId: string, clientName?: string) {
  const dropsData = ref<DropsData>({
    drops: [],
    futureDrops: [],
  })

  const { result: collectionData } = useQuery(
    unlockableCollectionById,
    { id: collectionId },
    { clientId: clientName },
  )

  watchEffect(() => {
    if (collectionData.value?.collectionEntity) {
      const { collectionEntity, nftEntitiesConnection } = collectionData.value
      const drops: Drop[] = []
      drops.push({
        collection: collectionEntity,
        minted: nftEntitiesConnection.totalCount,
        max: collectionEntity?.max ?? 300,
        dropStartTime: new Date(2023, 5, 6),
      })
      const futureDrops: Drop[] = []

      dropsData.value = {
        ...dropsData.value,
        drops,
        futureDrops,
      }
    }
  })
  return dropsData
}
