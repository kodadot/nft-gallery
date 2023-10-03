import { createMetadata, unSanitizeIpfsUrl } from '@kodadot1/minimark/utils'
import {
  nsfwAttribute,
  offsetAttribute,
  secondaryFileVisible,
} from '@/utils/mintUtils'
import { pinJson, rateLimitedPinFileToIPFS } from '@/services/nftStorage'
import { usePreferencesStore } from '@/stores/preferences'
import { IPFS_KODADOT_IMAGE_PLACEHOLDER } from '@/utils/constants'
import { uploadDirectWhenMultiple } from '@/utils/directUpload'
import { preheatFileFromIPFS } from '@/utils/ipfs'
import { TokenToMint } from '../types'

export async function constructMeta(
  tokenToMint: TokenToMint,
  options?: {
    enableCarbonOffset?: boolean
  }
): Promise<string> {
  const preferencesStore = usePreferencesStore()
  const { $consola } = useNuxtApp()
  const { file, name, description, secondFile, tags, nsfw } = tokenToMint
  const { enableCarbonOffset = false } = options || {}
  if (!file) {
    throw new ReferenceError('No file found!')
  }

  const fileHash = await rateLimitedPinFileToIPFS(file)
  const secondFileHash = secondFile
    ? await rateLimitedPinFileToIPFS(secondFile)
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
