import { createMetadata, unSanitizeIpfsUrl } from '@kodadot1/minimark/utils'
import type { ActionMintCollection } from '../types'
import { pinJson } from '@/services/nftStorage'
import { uploadDirect } from '@/utils/directUpload'
import { getImageTypeSafe, pinImageSafe } from '@/utils/safePin'

export async function constructMeta(item: ActionMintCollection) {
  const { file, name, description } = item.collection

  const { $consola } = useNuxtApp()
  const imageHash = await pinImageSafe(file)
  const type = getImageTypeSafe(file)
  const attributes = [] // createAttributes(item)

  const meta = createMetadata(
    name,
    description,
    imageHash,
    undefined,
    attributes,
    undefined,
    type,
  )
  const metaHash = await pinJson(meta)

  if (file) {
    $consola.log('[UPLOADING FILE]')
    uploadDirect(file, imageHash).catch($consola.warn)
  }

  return unSanitizeIpfsUrl(metaHash)
}
