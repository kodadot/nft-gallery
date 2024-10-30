import { createMetadata, unSanitizeIpfsUrl } from '@kodadot1/minimark/utils'
import { uploadMediaFiles } from './mintToken/constructDirectoryMeta'
import type { ActionUpdateCollection, UpdateCollectionParams } from './types'
import { pinFileToIPFS, pinJson } from '@/services/nftStorage'

const getIpfsMedia = async ({ collection: { image, banner, imageType } }: ActionUpdateCollection) => {
  const isImageFile = image instanceof File
  const isBannerFile = banner instanceof File

  let type = imageType

  const ipfs: { image: string, banner?: string } = { image: '', banner: '' }

  if (isImageFile && isBannerFile) {
    const mediaFiles = await uploadMediaFiles([image, banner])
    ipfs.image = mediaFiles[0]
    ipfs.banner = mediaFiles[1]
    type = getImageTypeSafe(image)
  }
  else if (isImageFile) {
    ipfs.image = await pinFileToIPFS(image)
    ipfs.banner = banner as string | undefined
    type = getImageTypeSafe(image)
  }
  else if (isBannerFile) {
    ipfs.image = image as string
    ipfs.banner = await pinFileToIPFS(banner)
  }
  else {
    ipfs.image = image as string
    ipfs.banner = banner as string | undefined
  }

  return {
    ...ipfs,
    type,
  }
}

const constructMeta = async (item: ActionUpdateCollection) => {
  const { name, description } = item.collection
  const { image, banner, type } = await getIpfsMedia(item)

  const attributes = []

  const meta = createMetadata(
    name,
    description,
    image,
    undefined,
    attributes,
    undefined,
    type,
  )

  const metaHash = await pinJson({ ...meta, banner } as any)

  return unSanitizeIpfsUrl(metaHash)
}

async function execUpdateCollectionStatmine({ item, api, executeTransaction, isLoading, status }: UpdateCollectionParams) {
  isLoading.value = true
  status.value = 'loader.ipfs'

  const metadata = await constructMeta(item)

  const collectionId = item.collectionId.toString()

  const args = [
    api.tx.nfts.setCollectionMetadata(collectionId, metadata),
    api.tx.nfts.setCollectionMaxSupply(collectionId, item.collection.max),
  ]

  executeTransaction({
    cb: api.tx.utility.batchAll,
    arg: [args],
    successMessage: item.successMessage,
    errorMessage: item.errorMessage,
  })
}

export async function execUpdateCollection({ item, ...params }: UpdateCollectionParams) {
  if (item.urlPrefix === 'ahk' || item.urlPrefix === 'ahp') {
    return execUpdateCollectionStatmine({ item, ...params })
  }
}
