import { IPFS_KODADOT_IMAGE_PLACEHOLDER } from './constants'
import { pinFileToIPFS } from '@/services/nftStorage'

type MaybeFile = File | null | undefined

export async function pinImageSafe(
  file: MaybeFile,
  token: string
): Promise<string> {
  if (!file) {
    return IPFS_KODADOT_IMAGE_PLACEHOLDER
  }

  return await pinFileToIPFS(file, token)
}

export function getImageTypeSafe(file: MaybeFile) {
  if (!file) {
    // expect that IPFS_KODADOT_IMAGE_PLACEHOLDER is here
    return 'image/png'
  }

  return file.type
}
