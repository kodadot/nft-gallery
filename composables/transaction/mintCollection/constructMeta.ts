import { ActionMintCollection } from '../types'
import { createMetadata, unSanitizeIpfsUrl } from '@kodadot1/minimark'
import { pinJson } from '@/services/nftStorage'
import { usePinningStore } from '@/stores/pinning'
import { uploadDirect } from '@/utils/directUpload'
import { getImageTypeSafe, pinImageSafe } from '@/utils/safePin'
import { Attribute } from '@kodadot1/minimark'

const createAttributes = ({
  tags,
  urlPrefix,
}: {
  tags: Attribute[]
  urlPrefix: string
}) => {
  if (urlPrefix === 'bsx' || urlPrefix === 'snek') {
    return tags.map((val) => ({
      ...val,
      display_type: null,
    }))
  }
  if (urlPrefix === 'rmrk' || urlPrefix === 'rmrk2') {
    return []
  }

  return []
}

export async function constructMeta(item: ActionMintCollection) {
  const { file, name, description, tags, urlPrefix } = item

  const pinningStore = usePinningStore()
  const { accountId } = useAuth()
  const { $consola } = useNuxtApp()
  const pinningKey = await pinningStore.fetchPinningKey(accountId.value)
  const imageHash = await pinImageSafe(file, pinningKey.token)
  const type = getImageTypeSafe(file)
  const attributes = createAttributes({ tags, urlPrefix })

  const meta = createMetadata(
    name,
    description,
    imageHash,
    undefined,
    attributes,
    undefined,
    type
  )
  const metaHash = await pinJson(meta, imageHash)

  if (file) {
    $consola.log('[UPLOADING FILE]')
    uploadDirect(file, imageHash).catch($consola.warn)
  }

  return unSanitizeIpfsUrl(metaHash)
}
