import { CollectionWithMeta } from '../rmrk/service/scheme'
import { getDropById, getDrops } from '@/services/waifu'
import unlockableCollectionById from '@/queries/subsquid/general/unlockableCollectionById.graphql'

export interface Drop {
  collection: CollectionWithMeta
  chain: string
  minted: number
  max: number
  dropStartTime: Date
  price: string
  alias: string
}

const futureDate = new Date()
futureDate.setDate(futureDate.getDate() * 7) // i weeks in the future

export function useDrops() {
  const drops = ref<Drop[]>([])
  onMounted(async () => {
    const dropsList = await getDrops()

    dropsList.forEach((drop) => {
      const { result: collectionData } = useQuery(
        unlockableCollectionById,
        { id: drop.collection },
        { clientId: drop.chain },
      )

      watchEffect(() => {
        if (collectionData.value?.collectionEntity) {
          const { collectionEntity, nftEntitiesConnection } =
            collectionData.value
          drops.value.push({
            ...drop,
            collection: collectionEntity,
            minted: nftEntitiesConnection.totalCount,
            max: collectionEntity?.max ?? 300,
            dropStartTime: new Date(2023, 5, 6),
            price: ['paid', 'generative'].includes(drop.type) ? drop.meta : '0',
          })
        }
      })
    }, [])
  })

  return drops
}

export async function useDrop(id: string) {
  const drop = await getDropById(id)

  return drop
}
