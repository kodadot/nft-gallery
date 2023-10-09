import { IPFS_KODADOT_IMAGE_PLACEHOLDER } from './constants'
import { pinFileToIPFS } from '@/services/nftStorage'

type MaybeFile = File | null | undefined

export async function pinImageSafe(file: MaybeFile): Promise<string> {
  if (!file) {
    return IPFS_KODADOT_IMAGE_PLACEHOLDER
  }

  return await pinFileToIPFS(file)
}

export function getImageTypeSafe(file: MaybeFile) {
  if (!file) {
    // expect that IPFS_KODADOT_IMAGE_PLACEHOLDER is here
    return 'image/png'
  }

  return file.type
}
