import type { Prefix } from '@kodadot1/static'
import { ApiFactory } from '@kodadot1/sub-api'
import { getChainEndpointByPrefix } from '@/utils/chain'

const BASE_URL = isProduction
  ? 'https://dyndata.koda.art'
  : 'https://dyndata-beta.koda.art'

const api = $fetch.create({
  baseURL: BASE_URL,
})

const apiInstanceByPrefix = (prefix: Prefix) => {
  const endpoint: string = getChainEndpointByPrefix(prefix) || ''
  return ApiFactory.useApiInstance(endpoint)
}

const lastIdAssethub = async (prefix: Prefix, collectionId: number) => {
  const api = await apiInstanceByPrefix(prefix)
  const ids = await api.query.nfts.item.keys(collectionId)
  const ints = ids.map(id => Number.parseInt(id.toHuman()?.[1]?.replaceAll(',', '') || '0'))
  const biggestId = Math.max(...ints)
  return biggestId
}

// store latest IDs for each collection
const latestIdsMap = new Map<string, number>()

export const generateIdAssethub = async (collectionId: number, prefix?: Prefix) => {
  // 237 is the latest drops collection id to handle backwards compatibility
  if (collectionId <= 273 && prefix) {
    const mapKey = `${prefix}-${collectionId}`

    if (!latestIdsMap.has(mapKey)) {
      // Only query the chain if we haven't stored an ID yet
      const lastId = await lastIdAssethub(prefix, collectionId)
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
