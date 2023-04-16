import { POPULAR_COLLECTIONS } from './constants'
import { CollectionEntityMinimal } from '@/components/collection/utils/types'

type QueryResult = {
  value: {
    collectionEntities: Collection[]
  }
}

function handleResult(result: QueryResult[]): Collection[] {
  return result
    .map((data, index) => {
      const chain = Object.keys(POPULAR_COLLECTIONS)[index]
      return data.value?.collectionEntities?.map((item) => ({
        ...item,
        owners: new Set(item.nfts.map((x) => x.currentOwner)).size,
        chain,
      }))
    })
    .flat()
}

export const collectionArray = ref<CollectionEntityMinimal[]>([])

export type Collection = CollectionEntityMinimal & {
  owners: number
  chain: string
  meta: {
    name: string
  }
  nfts: {
    currentOwner: string
  }[]
}

export const usePopularCollections = () => {
  const collections = ref<Collection[]>([])
  const resArr = ref<QueryResult[]>([])
  const loadingMap = reactive<{
    [key: string]: { value: boolean }
  }>({})

  for (const [clientName, ids] of Object.entries(POPULAR_COLLECTIONS)) {
    const { data, loading } = useGraphql({
      queryName: 'collectionByIds',
      clientName,
      variables: {
        ids,
      },
    })
    loadingMap[clientName] = loading
    resArr.value.push(data)
  }

  // Aoid using Array as root value for reactive() as it cannot be tracked in watch() or watchEffect(). Use ref() instead. This is a Vue-2-only limitation.
  watch(loadingMap, (val) => {
    Object.keys(val).forEach((key) => {
      if (!loadingMap[key].value) {
        collections.value = collections.value.concat(handleResult(resArr.value))
        collectionArray.value = collections.value
      }
    })
  })

  return {
    collections,
  }
}
