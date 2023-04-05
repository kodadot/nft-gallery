import { createMetadata, unSanitizeIpfsUrl } from '@kodadot1/minimark'
import {
  nsfwAttribute,
  offsetAttribute,
  secondaryFileVisible,
} from '@/utils/mintUtils'
import { pinFileToIPFS, pinJson } from '@/services/nftStorage'
import { usePinningStore } from '@/stores/pinning'
import { usePreferencesStore } from '@/stores/preferences'
import { IPFS_KODADOT_IMAGE_PLACEHOLDER } from '@/utils/constants'
import { uploadDirectWhenMultiple } from '@/utils/directUpload'
import { preheatFileFromIPFS } from '@/utils/ipfs'
import { ActionMintToken } from '../types'

export async function constructMeta(
  item: ActionMintToken,
  options?: {
    enableCarbonOffset?: boolean
  }
): Promise<string> {
  const pinningStore = usePinningStore()
  const preferencesStore = usePreferencesStore()
  const { accountId } = useAuth()
  const { $consola } = useNuxtApp()
  const { file, name, description, secondFile, tags, nsfw } = item.token
  const { enableCarbonOffset = false } = options || {}
  if (!file) {
    throw new ReferenceError('No file found!')
  }

  const { token } = await pinningStore.fetchPinningKey(accountId.value)
  const fileHash = await pinFileToIPFS(file, token)
  const secondFileHash = secondFile
    ? await pinFileToIPFS(secondFile, token)
    : undefined

  let imageHash: string | undefined = fileHash
  let animationUrl: string | undefined

  // if secondaryFileVisible(file) then assign secondaryFileHash to image and set animationUrl to fileHash
  if (secondaryFileVisible(file)) {
    animationUrl = fileHash
    imageHash = secondFileHash || IPFS_KODADOT_IMAGE_PLACEHOLDER
  }

  const attributes = [
    ...(tags || []),
    ...nsfwAttribute(nsfw),
    ...(enableCarbonOffset
      ? offsetAttribute(preferencesStore.getHasCarbonOffset)
      : []),
  ]

  const meta = createMetadata(
    name,
    description,
    imageHash,
    animationUrl,
    attributes,
    'https://kodadot.xyz',
    file.type
  )

  const metaHash = await pinJson(meta, imageHash)
  preheatFileFromIPFS(fileHash)
  uploadDirectWhenMultiple(
    [file, secondFile],
    [fileHash, secondFileHash]
  ).catch($consola.warn)
  return unSanitizeIpfsUrl(metaHash)
}
