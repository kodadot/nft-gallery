import type { Prefix } from '@kodadot1/static'
import { getLastIndexUsedOnChain } from '@/composables/transaction/mintToken/utils'

const BASE_URL = isProduction
  ? 'https://dyndata.koda.art'
  : 'https://dyndata-beta.koda.art'

const api = $fetch.create({
  baseURL: BASE_URL,
})

// store latest IDs for each collection
const latestIdsMap = new Map<string, number>()

export const generateIdAssethub = async (collectionId: number, prefix?: Prefix) => {
  // 237 is the latest drops collection id to handle backwards compatibility
  if (collectionId <= 273 && prefix) {
    const mapKey = `${prefix}-${collectionId}`

    if (!latestIdsMap.has(mapKey)) {
      // Only query the chain if we haven't stored an ID yet
      const { apiInstance } = useApi()
      const lastId = await getLastIndexUsedOnChain(await apiInstance.value, collectionId)
      latestIdsMap.set(mapKey, lastId)
    }

    // Increment and store the new ID
    const nextId = latestIdsMap.get(mapKey)! + 1
    latestIdsMap.set(mapKey, nextId)
    return nextId.toString()
  }

  return (await api('/generate-id')) as string
}

export const generateId = async () => {
  return (await api('/generate-id')) as string
}

export const setDyndataUrl = ({ chain, collection, nft }) => {
  const metadata = `https://dyndata.koda.art/v1/metadata/${chain}/${collection}/${nft}`
  const image = `https://dyndata.koda.art/v1/image/${chain}/${collection}/${nft}`

  return {
    metadata,
    image,
  }
}
