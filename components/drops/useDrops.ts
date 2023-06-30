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

export function useDrops(collectionId: string, clientName?: string) {
  const dropsData = ref<DropsData>({
    drops: [],
    futureDrops: [],
  })

  const { data: collectionData } = useGraphql({
    queryName: 'unlockableCollectionById',
    clientName,
    variables: {
      id: collectionId,
    },
  })

  watch(collectionData, () => {
    if (collectionData.value) {
      const { collectionEntity, nftEntitiesConnection } = collectionData.value
      const drops: Drop[] = []
      drops.push({
        collection: collectionEntity,
        minted: nftEntitiesConnection.totalCount,
        max: collectionEntity.max || 300,
        dropStartTime: new Date(2023, 5, 6),
      })

      // const futureDrops: Drop[] = []
      // for (let i = 1; i <= 4; i++) {
      //   const futureDate = new Date(now)
      //   futureDate.setDate(now.getDate() + i * 7) // i weeks in the future
      //   futureDrops.push({
      //     collection: collectionEntity,
      //     minted: nftEntitiesConnection.totalCount,
      //     max: collectionEntity.max || 300,
      //     dropStartTime: futureDate,
      //   })
      // }

      dropsData.value = {
        ...dropsData.value,
        drops,
        // futureDrops,
      }
    }
  })

  return dropsData
}
