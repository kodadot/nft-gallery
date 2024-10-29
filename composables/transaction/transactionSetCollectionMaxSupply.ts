import { createMetadata, unSanitizeIpfsUrl } from '@kodadot1/minimark/utils'
import { uploadMediaFiles } from './mintToken/constructDirectoryMeta'
import type { ActionUpdateCollection, UpdateCollectionParams } from './types'
import { pinFileToIPFS, pinJson } from '@/services/nftStorage'

const constructMeta = async (item: ActionUpdateCollection) => {
  const { name, description, image, banner, imageType } = item.collection

  const mediaFiles = [] as File[]
  const isImageFile = image instanceof File
  const isBannerFile = banner instanceof File

  let type = imageType

  if (isImageFile) {
    mediaFiles.push(image)
    type = getImageTypeSafe(image)
  }

  if (isBannerFile) {
    mediaFiles.push(banner)
  }

  const ipfs = { image: '', banner: '' }

  if (isImageFile && isBannerFile) {
    const [image, banner] = await uploadMediaFiles(mediaFiles)
    ipfs.image = image
    ipfs.banner = banner
  }
  else if (isImageFile) {
    ipfs.image = await pinFileToIPFS(image)
    ipfs.banner = banner as string
  }
  else if (isBannerFile) {
    ipfs.image = image as string
    ipfs.banner = await pinFileToIPFS(banner)
  }
  else {
    ipfs.image = image as string
    ipfs.banner = banner as string
  }

  const attributes = []

  const meta = createMetadata(
    name,
    description,
    ipfs.image,
    undefined,
    attributes,
    undefined,
    type,
  )

  const metaHash = await pinJson(meta)

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
