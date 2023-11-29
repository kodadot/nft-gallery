import { CollectionWithMeta } from '../rmrk/service/scheme'
import {
  getDropById,
  getDropMintedStatus,
  getDropStatus,
  getDrops,
} from '@/services/waifu'
import unlockableCollectionById from '@/queries/subsquid/general/unlockableCollectionById.graphql'

export interface Drop {
  collection: CollectionWithMeta
  chain: string
  minted: number
  max: number
  disabled: number
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

      watchEffect(async () => {
        if (collectionData.value?.collectionEntity) {
          const { collectionEntity } = collectionData.value
          const chainMax = collectionEntity?.max ?? 300
          const { count } = await getDropStatus(drop.alias)
          drops.value.push({
            ...drop,
            collection: collectionEntity,
            minted: Math.min(count, chainMax),
            max: chainMax,
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

export const useDropStatus = (id: string) => {
  const currentAccountMintedToken = ref<{
    created_at: string
    id: number
    image: string
    metadata: string
  } | null>(null)
  const mintedDropCount = ref(0)
  const { accountId } = useAuth()

  const fetchDropStatus = async () => {
    const { count } = await getDropStatus(id)
    mintedDropCount.value = count
    currentAccountMintedToken.value = accountId.value
      ? await getDropMintedStatus(id, accountId.value)
      : null
  }
  onBeforeMount(fetchDropStatus)

  watch(accountId, fetchDropStatus)

  return {
    currentAccountMintedToken,
    mintedDropCount,
    fetchDropStatus,
  }
}
