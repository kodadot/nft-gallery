import { CollectionWithMeta } from '../rmrk/service/scheme'
import { getDrops } from '@/services/waifu'

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
      const { data: collectionData } = useGraphql({
        queryName: 'unlockableCollectionById',
        clientName: drop.chain,
        variables: {
          id: drop.collection,
        },
      })

      watch(collectionData, () => {
        if (collectionData.value?.collectionEntity) {
          const { collectionEntity, nftEntitiesConnection } =
            collectionData.value
          drops.value.push({
            collection: collectionEntity,
            minted: nftEntitiesConnection.totalCount,
            max: collectionEntity?.max ?? 300,
            dropStartTime: new Date(2023, 5, 6),
            chain: drop.chain,
            price: drop.type === 'paid' ? drop.meta : '0',
            alias: drop.id, // todo: get alias from api result
          })
        }
      })
    }, [])
  })

  return drops
}
