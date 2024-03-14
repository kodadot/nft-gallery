import { ImageDataPayload } from '@/composables/drop/useGenerativeIframeData'
import { pinFileToIPFS } from '@/services/nftStorage'
import { getRandomIntFromRange } from '@/components/collection/unlockable/utils'
import { blake2AsHex, encodeAddress } from '@polkadot/util-crypto'

export type EntropyRange = [number, number]

export type GenerativePreviewItem = {
  hash: string
  image: string
  entropyRange: EntropyRange
}

export const getEntropyRange = (num: number, step = 64): EntropyRange => [
  step * num,
  step * (num + 1),
]

export const getCaptureImageFile = async ({
  image,
  data: imageDataPayload,
}: {
  image: string
  data: ImageDataPayload
}) => {
  const selectedImageHash = image.split('?hash=')[1]
  const isTheSameImage = selectedImageHash === imageDataPayload?.hash
  if (!imageDataPayload?.image || !isTheSameImage) {
    throw new Error('Failed to load image, please try again later')
  }
  const res = (await fetch(imageDataPayload.image)) as any
  return new File([res], 'image.png', { type: 'image/png' })
}

export const tryCapture = async ({
  image,
  data,
}: {
  image: string
  data: ImageDataPayload
}) => {
  const imgFile = await getCaptureImageFile({ image, data })
  const imageHash = await pinFileToIPFS(imgFile)
  return imageHash
}

const getHash = (randomSs58Format: number, accountId: string) => {
  const ss58Format = isValidSs58Format(randomSs58Format) ? randomSs58Format : 0

  // https://github.com/paritytech/ss58-registry/blob/30889d6c9d332953a6e3333b30513eef89003f64/ss58-registry.json#L1292C17-L1292C22
  const initialValue = accountId
    ? encodeAddress(accountId, ss58Format)
    : String(Date.now() << ss58Format)
  return blake2AsHex(initialValue, 256, null, true)
}

const generateHash = (range: EntropyRange, accountId: string) =>
  getHash(getRandomIntFromRange(...range), accountId)

export const generatePreviewItem = ({
  entropyRange,
  accountId,
  content,
}: {
  entropyRange: EntropyRange
  accountId: string
  content: string
}): GenerativePreviewItem => {
  const hash = generateHash(entropyRange, accountId)
  const image = `${content}/?hash=${hash}`
  return { hash, image, entropyRange }
}
