import { ActionMintCollection, CollectionToMintBasilisk } from '../types'
import { createMetadata, unSanitizeIpfsUrl } from '@kodadot1/minimark/utils'
import { pinJson } from '@/services/nftStorage'
import { uploadDirect } from '@/utils/directUpload'
import { getImageTypeSafe, pinImageSafe } from '@/utils/safePin'

const createAttributes = (item: ActionMintCollection) => {
  if (item.urlPrefix === 'bsx') {
    return (item.collection as CollectionToMintBasilisk).tags.map((val) => ({
      ...val,
      display_type: null,
    }))
  }
  if (item.urlPrefix === 'rmrk' || item.urlPrefix === 'ksm') {
    return []
  }

  return []
}

export async function constructMeta(item: ActionMintCollection) {
  const { file, name, description } = item.collection

  const { $consola } = useNuxtApp()
  const imageHash = await pinImageSafe(file)
  const type = getImageTypeSafe(file)
  const attributes = createAttributes(item)

  const meta = createMetadata(
    name,
    description,
    imageHash,
    undefined,
    attributes,
    undefined,
    type,
  )
  const metaHash = await pinJson(meta, imageHash)

  if (file) {
    $consola.log('[UPLOADING FILE]')
    uploadDirect(file, imageHash).catch($consola.warn)
  }

  return unSanitizeIpfsUrl(metaHash)
}
