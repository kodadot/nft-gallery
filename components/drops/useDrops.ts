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

const futureDate = new Date()
futureDate.setDate(futureDate.getDate() * 7) // i weeks in the future

const dummyDrop: Drop = {
  collection: {
    name: 'Create your own drop page',
    metadata:
      'ipfs://ipfs/bafkreidvb2my5vj6jgpbrwa7dfw55tryhfk7um5inuxnz7y7khqse2thjq',
  } as any,
  minted: 0,
  max: 300,
  dropStartTime: futureDate,
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
    if (collectionData.value?.collectionEntity) {
      const { collectionEntity, nftEntitiesConnection } = collectionData.value
      const drops: Drop[] = []
      drops.push({
        collection: collectionEntity,
        minted: nftEntitiesConnection.totalCount,
        max: collectionEntity?.max || 300,
        dropStartTime: new Date(2023, 5, 6),
      })

      const futureDrops: Drop[] = []
      if (!clientName) {
        futureDrops.push(dummyDrop)
      }

      dropsData.value = {
        ...dropsData.value,
        drops,
        futureDrops,
      }
    }
  })

  return dropsData
}
