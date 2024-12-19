import { protocolize } from '@kodadot1/hyperdata'
import type { SetNftMetadataParams, ActionSetNftMetadata } from './types'
import type { Metadata } from '@/services/nftStorage'
import { pinJson, rateLimitedPinFileToIPFS } from '@/services/nftStorage'

const constructMeta = async (item: ActionSetNftMetadata) => {
  const { name, description, attributes, image } = item.metadata

  let imageHash: string | undefined
  let type: string | undefined

  if (image instanceof File) {
    imageHash = protocolize(await rateLimitedPinFileToIPFS(image))
    type = getImageTypeSafe(image)
  }
  else {
    imageHash = image
    type = item.metadata.type
  }

  const meta = {
    ...item.metadata,
    name,
    description,
    image: imageHash,
    attributes,
    type,
  } as Metadata

  const metaHash = await pinJson(meta)

  return protocolize(metaHash)
}

async function execSetNftMetadataStatmine({ item, api, executeTransaction, isLoading, status }: SetNftMetadataParams) {
  isLoading.value = true
  status.value = 'loader.ipfs'

  const metadata = await constructMeta(item)

  executeTransaction({
    cb: api.tx.nfts.setMetadata,
    arg: [item.collectionId, item.nftSn, metadata],
    successMessage: item.successMessage,
    errorMessage: item.errorMessage,
  })
}

export async function execSetNftMetadata({ item, ...params }: SetNftMetadataParams) {
  if (item.urlPrefix === 'ahk' || item.urlPrefix === 'ahp') {
    return execSetNftMetadataStatmine({ item, ...params })
  }
}
