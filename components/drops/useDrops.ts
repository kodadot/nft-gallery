import { CollectionWithMeta } from '../rmrk/service/scheme'

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

export function useDrops(collectionId: string) {
  const dropsData = ref<DropsData>({
    drops: [],
    futureDrops: [],
  })

  const { data: collectionData } = useGraphql({
    queryName: 'unlockableCollectionById',
    variables: {
      id: collectionId,
    },
  })

  watch(collectionData, () => {
    if (collectionData.value) {
      const { collectionEntity, nftEntitiesConnection } = collectionData.value
      const now = new Date()

      const drops: Drop[] = []

      for (let i = 1; i <= 2; i++) {
        const pastDate = new Date(now)
        pastDate.setDate(now.getDate() - i) // i days in the past

        drops.push({
          collection: collectionEntity,
          minted: nftEntitiesConnection.totalCount,
          max: collectionEntity.max || 300,
          dropStartTime: pastDate,
        })
      }

      const futureDrops: Drop[] = []
      for (let i = 1; i <= 4; i++) {
        const futureDate = new Date(now)
        futureDate.setDate(now.getDate() + i * 7) // i weeks in the future
        futureDrops.push({
          collection: collectionEntity,
          minted: nftEntitiesConnection.totalCount,
          max: collectionEntity.max || 300,
          dropStartTime: futureDate,
        })
      }

      dropsData.value = {
        drops,
        futureDrops,
      }
    }
  })

  return dropsData
}
