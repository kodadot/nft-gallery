import { createMetadata, unSanitizeIpfsUrl } from '@kodadot1/minimark/utils'
import type { SubmittableExtrinsic } from '@polkadot/api-base/types'
import { uploadMediaFiles } from './mintToken/constructDirectoryMeta'
import type { ActionUpdateCollection, UpdateCollectionParams } from './types'
import { pinFileToIPFS, pinJson } from '@/services/nftStorage'

const getIpfsMedia = async ({ collection: { image, banner, imageType } }: ActionUpdateCollection) => {
  const isImageFile = image instanceof File
  const isBannerFile = banner instanceof File

  let type = imageType

  const ipfs: { image: string, banner?: string } = { image: '', banner: '' }

  if (isImageFile && isBannerFile) {
    [ipfs.image, ipfs.banner] = await uploadMediaFiles([image, banner])
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

  // TODO: add banner field to minimark https://github.com/kodadot/packages/blob/main/minimark/src/utils/metadata.ts#L4
  Object.assign(meta, { banner: banner ? unSanitizeIpfsUrl(banner) : '' })

  const metaHash = await pinJson(meta as any)

  return unSanitizeIpfsUrl(metaHash)
}

async function execUpdateCollectionStatmine({ item, api, executeTransaction, isLoading, status }: UpdateCollectionParams) {
  isLoading.value = true
  status.value = 'loader.ipfs'

  const args: SubmittableExtrinsic<'promise'>[] = []

  if (item.update.metadata) {
    const metadata = await constructMeta(item)
    args.push(api.tx.nfts.setCollectionMetadata(item.collectionId, metadata))
  }

  if (item.update.max) {
    args.push(api.tx.nfts.setCollectionMaxSupply(item.collectionId, item.collection.max ? item.collection.max : undefined))
  }

  if (item.update.permission) {
    args.push(api.tx.nfts.updateMintSettings(item.collectionId, item.collection.mintingSettings))
  }

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
